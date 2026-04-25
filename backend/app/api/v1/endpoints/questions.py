from fastapi import APIRouter, HTTPException, status

from backend.app.dependencies import CurrentUser, QuestionServiceDep
from backend.app.schemas.question import (
    GenerateQuestionRequest,
    GenerateQuestionResponse,
    PublicQuestion,
    VerifyQuestionRequest,
    VerifyQuestionResponse,
)

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/{question_key}", response_model=PublicQuestion)
async def get_question(
    question_key: str,
    service: QuestionServiceDep,
    _current_user: CurrentUser,
) -> PublicQuestion:
    """Retrieve a cached question by its key without generating a new one."""
    cached = service.cache.get(question_key)
    if not cached:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found or expired",
        )
    return service._to_public_question(cached)



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
