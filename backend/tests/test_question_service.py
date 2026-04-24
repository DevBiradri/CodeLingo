from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from backend.app.core.config import Settings
from backend.app.db.base import Base
from backend.app.models import session as session_model  # noqa: F401
from backend.app.models.user import User
from backend.app.schemas.question import (
    GeneratedQuestion,
    GenerateQuestionRequest,
    RefactorJudgeResult,
    RubricBreakdownItem,
    VerifyQuestionRequest,
)
from backend.app.services.question_cache import InMemoryQuestionCache
from backend.app.services.question_service import QuestionService


class FakeGeminiService:
    def __init__(
        self, generated: GeneratedQuestion, judge_result: RefactorJudgeResult
    ) -> None:
        self.generated = generated
        self.judge_result = judge_result

    async def generate_question(
        self, payload: GenerateQuestionRequest
    ) -> GeneratedQuestion:
        return self.generated

    async def judge_refactor(
        self,
        *,
        original_code: str,
        user_submission: str,
        evaluation_rubric: list[str],
        success_threshold: int,
    ) -> RefactorJudgeResult:
        return self.judge_result


class QuestionServiceTestCase(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory()
        db_path = Path(self.tempdir.name) / "test.db"
        self.engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}")
        self.sessionmaker = async_sessionmaker(
            self.engine, expire_on_commit=False, class_=AsyncSession
        )

        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def asyncTearDown(self) -> None:
        await self.engine.dispose()
        self.tempdir.cleanup()

    async def _create_user(self) -> User:
        async with self.sessionmaker() as session:
            user = User(
                email="user@example.com",
                username="user",
                name="User",
                password_hash="hash",
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user

    def _settings(self) -> Settings:
        return Settings(
            secret_key="test",
            database_url="sqlite+aiosqlite:///unused.db",
            challenge_success_xp=10,
            refactor_success_threshold=70,
            question_cache_ttl_seconds=3600,
        )

    def _question(self) -> GeneratedQuestion:
        return GeneratedQuestion.model_validate(
            {
                "challenge_id": "vars_01_naming",
                "topic_context": "Naming variables clearly",
                "difficulty_score": 3,
                "challenges": [
                    {
                        "type": "drag_and_drop",
                        "instruction": "Fill the blanks",
                        "code_with_blanks": "x = {{blank1}}",
                        "options": ["1", "2"],
                        "solution": {"blank1": "1"},
                    },
                    {
                        "type": "predict_output",
                        "instruction": "Predict output",
                        "code_snippet": "print(1+1)",
                        "options": ["1", "2"],
                        "correct_answer": "2",
                    },
                    {
                        "type": "refactor",
                        "instruction": "Refactor this",
                        "initial_code": "def f(x):\n    if x:\n        return True\n    else:\n        return False",
                        "eval_rubric": [
                            "Preserve behavior",
                            "Remove unnecessary else",
                            "Use clearer naming",
                        ],
                    },
                ],
            }
        )

    def _judge_result(self, passed: bool) -> RefactorJudgeResult:
        return RefactorJudgeResult(
            score=85 if passed else 40,
            passed=passed,
            feedback="Good progress.",
            rubric_breakdown=[
                RubricBreakdownItem(
                    criterion="Preserve behavior",
                    met=passed,
                    comment="Looks correct" if passed else "Behavior changed",
                )
            ],
        )

    async def test_generate_question_strips_solution_fields(self) -> None:
        async with self.sessionmaker() as session:
            service = QuestionService(
                db=session,
                settings=self._settings(),
                cache=InMemoryQuestionCache(3600),
                llm=FakeGeminiService(self._question(), self._judge_result(True)),
            )
            response = await service.generate_question(
                GenerateQuestionRequest(
                    main_topic="Variables",
                    subtopic="Naming",
                    educational_tip="Choose clear names",
                )
            )

            self.assertTrue(response.question_key)
            challenge_dump = [
                item.model_dump() for item in response.question.challenges
            ]
            self.assertNotIn("solution", challenge_dump[0])
            self.assertNotIn("correct_answer", challenge_dump[1])

    async def test_verify_wrong_answer_reduces_health(self) -> None:
        user = await self._create_user()
        async with self.sessionmaker() as session:
            cache = InMemoryQuestionCache(3600)
            key = cache.put(self._question())
            service = QuestionService(
                db=session,
                settings=self._settings(),
                cache=cache,
                llm=FakeGeminiService(self._question(), self._judge_result(True)),
            )

            result = await service.verify_answer(
                user_id=user.id,
                payload=VerifyQuestionRequest(
                    question_key=key,
                    challenge_index=1,
                    answer="1",
                ),
            )

            self.assertFalse(result.correct)
            self.assertEqual(result.health_points, 4)
            self.assertEqual(result.experience_points, 0)

    async def test_verify_correct_answer_awards_experience(self) -> None:
        user = await self._create_user()
        async with self.sessionmaker() as session:
            cache = InMemoryQuestionCache(3600)
            key = cache.put(self._question())
            service = QuestionService(
                db=session,
                settings=self._settings(),
                cache=cache,
                llm=FakeGeminiService(self._question(), self._judge_result(True)),
            )

            result = await service.verify_answer(
                user_id=user.id,
                payload=VerifyQuestionRequest(
                    question_key=key,
                    challenge_index=0,
                    answer={"blank1": "1"},
                ),
            )

            self.assertTrue(result.correct)
            self.assertEqual(result.experience_points, 10)
            self.assertEqual(result.health_points, 5)

    async def test_verify_refactor_uses_judge_result(self) -> None:
        user = await self._create_user()
        async with self.sessionmaker() as session:
            cache = InMemoryQuestionCache(3600)
            key = cache.put(self._question())
            service = QuestionService(
                db=session,
                settings=self._settings(),
                cache=cache,
                llm=FakeGeminiService(self._question(), self._judge_result(False)),
            )

            result = await service.verify_answer(
                user_id=user.id,
                payload=VerifyQuestionRequest(
                    question_key=key,
                    challenge_index=2,
                    answer="def f(value):\n    return bool(value)",
                ),
            )

            self.assertFalse(result.correct)
            self.assertEqual(result.score, 40)
            self.assertIsNotNone(result.rubric_breakdown)
