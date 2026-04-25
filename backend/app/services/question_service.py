from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import Settings
from backend.app.core.levels import get_level_info
from backend.app.schemas.question import (
    DragAndDropChallenge,
    GeneratedQuestion,
    GenerateQuestionRequest,
    GenerateQuestionResponse,
    PredictOutputChallenge,
    PublicQuestion,
    RefactorChallenge,
    RefactorJudgeResult,
    VerifyQuestionRequest,
    VerifyQuestionResponse,
)
from backend.app.services.gemini_service import GeminiService
from backend.app.services.progress_service import ProgressService
from backend.app.services.question_cache import InMemoryQuestionCache


class QuestionService:
    def __init__(
        self,
        *,
        db: AsyncSession,
        settings: Settings,
        cache: InMemoryQuestionCache,
        llm: GeminiService,
    ) -> None:
        self.db = db
        self.settings = settings
        self.cache = cache
        self.llm = llm
        self.progress_service = ProgressService(db)

    async def generate_question(
        self, payload: GenerateQuestionRequest
    ) -> GenerateQuestionResponse:
        generated = await self.llm.generate_question(payload)
        key = self.cache.put(generated)
        public_question = self._to_public_question(generated)
        return GenerateQuestionResponse(question_key=key, question=public_question)

    async def verify_answer(
        self,
        *,
        user_id: str,
        payload: VerifyQuestionRequest,
    ) -> VerifyQuestionResponse:
        generated = self.cache.get(payload.question_key)
        if generated is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found or expired",
            )

        if payload.challenge_index >= len(generated.challenges):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid challenge index",
            )

        challenge = generated.challenges[payload.challenge_index]

        if isinstance(challenge, DragAndDropChallenge):
            correct = self._verify_drag_and_drop(challenge, payload.answer)
            judge_result = None
        elif isinstance(challenge, PredictOutputChallenge):
            correct = self._verify_predict_output(challenge, payload.answer)
            judge_result = None
        elif isinstance(challenge, RefactorChallenge):
            judge_result = await self._verify_refactor(challenge, payload)
            correct = judge_result.passed
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported challenge type",
            )

        xp_earned = 0
        hp_consumed = 0
        subtopic_missions_completed = 0

        if correct:
            xp_earned = self.settings.challenge_success_xp
            user = await self.progress_service.award_experience(
                user_id=user_id, amount=xp_earned
            )
            # Increment mission count if subtopic is known
            if generated.subtopic:
                user = await self.progress_service.increment_mission_count(
                    user_id=user_id, subtopic=generated.subtopic
                )
                subtopic_missions_completed = user.completed_missions.get(generated.subtopic, 0)
        else:
            hp_consumed = 1
            user = await self.progress_service.record_failure(user_id)
            if generated.subtopic:
                subtopic_missions_completed = user.completed_missions.get(generated.subtopic, 0)

        level_info = get_level_info(user.experience_points)

        response = VerifyQuestionResponse(
            correct=correct,
            challenge_type=challenge.type,
            experience_points=user.experience_points,
            xp_earned=xp_earned,
            health_points=user.health_points,
            hp_consumed=hp_consumed,
            health_next_regen_at=user.health_next_regen_at,
            level=level_info.level,
            level_name=level_info.level_name,
            xp_for_current_level=level_info.xp_for_current_level,
            xp_for_next_level=level_info.xp_for_next_level,
            xp_to_next_level=level_info.xp_to_next_level,
            subtopic_missions_completed=subtopic_missions_completed,
        )

        if not correct:
            if isinstance(challenge, DragAndDropChallenge):
                response.correct_answer = challenge.solution
            elif isinstance(challenge, PredictOutputChallenge):
                response.correct_answer = challenge.correct_answer

        if judge_result is not None:
            response.score = judge_result.score
            response.feedback = judge_result.feedback
            response.rubric_breakdown = judge_result.rubric_breakdown

        return response

    def _to_public_question(self, generated: GeneratedQuestion) -> PublicQuestion:
        content = generated.model_dump(exclude_none=False) # Ensure subtopic is kept
        for challenge in content.get("challenges", []):
            challenge.pop("solution", None)
            challenge.pop("correct_answer", None)
        return PublicQuestion.model_validate(content)

    def _verify_drag_and_drop(
        self, challenge: DragAndDropChallenge, answer: dict[str, str] | str
    ) -> bool:
        if not isinstance(answer, dict):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Drag and drop answers must be an object",
            )
        expected = {k: v.strip() for k, v in challenge.solution.items()}
        provided = {k: v.strip() for k, v in answer.items()}
        return provided == expected

    def _verify_predict_output(
        self, challenge: PredictOutputChallenge, answer: dict[str, str] | str
    ) -> bool:
        if not isinstance(answer, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Predict output answers must be a string",
            )
        return answer.strip() == challenge.correct_answer.strip()

    async def _verify_refactor(
        self,
        challenge: RefactorChallenge,
        payload: VerifyQuestionRequest,
    ) -> RefactorJudgeResult:
        if not isinstance(payload.answer, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Refactor answers must be a code string",
            )

        threshold = (
            payload.success_threshold
            if payload.success_threshold is not None
            else self.settings.refactor_success_threshold
        )
        return await self.llm.judge_refactor(
            original_code=challenge.initial_code,
            user_submission=payload.answer,
            evaluation_rubric=challenge.eval_rubric,
            success_threshold=threshold,
        )
