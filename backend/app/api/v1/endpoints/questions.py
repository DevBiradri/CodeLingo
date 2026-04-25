from fastapi import APIRouter

from backend.app.dependencies import CurrentUser, QuestionServiceDep
from backend.app.schemas.question import (
    GenerateQuestionRequest,
    GenerateQuestionResponse,
    VerifyQuestionRequest,
    VerifyQuestionResponse,
)

router = APIRouter(prefix="/questions", tags=["questions"])


@router.post("/generate", response_model=GenerateQuestionResponse)
async def generate_question(
    payload: GenerateQuestionRequest,
    service: QuestionServiceDep,
    _current_user: CurrentUser,
) -> GenerateQuestionResponse:
    """Generate a new question using the Gemini LLM.

    Returns a `question_key` that must be passed to `/questions/verify`
    within the cache TTL window (default 30 minutes).
    """
    return await service.generate_question(payload)


@router.post("/verify", response_model=VerifyQuestionResponse)
async def verify_answer(
    payload: VerifyQuestionRequest,
    service: QuestionServiceDep,
    current_user: CurrentUser,
) -> VerifyQuestionResponse:
    """Verify the user's answer to a cached question.

    - Correct answers award XP.
    - Wrong answers consume 1 HP (returns 429 if HP is 0).
    - For `refactor` challenges the answer is graded by an LLM judge.
    """
    return await service.verify_answer(user_id=current_user.id, payload=payload)
