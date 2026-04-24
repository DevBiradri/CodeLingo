from __future__ import annotations

from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field


class RefactorChallenge(BaseModel):
    type: Literal["refactor"]
    instruction: str
    initial_code: str
    eval_rubric: list[str] = Field(min_length=3, max_length=5)


class DragAndDropChallenge(BaseModel):
    type: Literal["drag_and_drop"]
    instruction: str
    code_with_blanks: str
    options: list[str]
    solution: dict[str, str]


class PredictOutputChallenge(BaseModel):
    type: Literal["predict_output"]
    instruction: str
    code_snippet: str
    options: list[str]
    correct_answer: str


Challenge = Annotated[
    RefactorChallenge | DragAndDropChallenge | PredictOutputChallenge,
    Field(discriminator="type"),
]


class GeneratedQuestion(BaseModel):
    challenge_id: str
    topic_context: str
    difficulty_score: int | None = Field(default=None, ge=1, le=10)
    challenges: list[Challenge] = Field(min_length=1)


class RefactorChallengePublic(BaseModel):
    type: Literal["refactor"]
    instruction: str
    initial_code: str
    eval_rubric: list[str]


class DragAndDropChallengePublic(BaseModel):
    type: Literal["drag_and_drop"]
    instruction: str
    code_with_blanks: str
    options: list[str]


class PredictOutputChallengePublic(BaseModel):
    type: Literal["predict_output"]
    instruction: str
    code_snippet: str
    options: list[str]


PublicChallenge = Annotated[
    RefactorChallengePublic | DragAndDropChallengePublic | PredictOutputChallengePublic,
    Field(discriminator="type"),
]


class PublicQuestion(BaseModel):
    challenge_id: str
    topic_context: str
    difficulty_score: int | None = Field(default=None, ge=1, le=10)
    challenges: list[PublicChallenge]


class GenerateQuestionRequest(BaseModel):
    main_topic: str
    subtopic: str
    educational_tip: str


class GenerateQuestionResponse(BaseModel):
    question_key: str
    question: PublicQuestion


class VerifyQuestionRequest(BaseModel):
    question_key: str
    challenge_index: int = Field(ge=0)
    answer: dict[str, str] | str
    success_threshold: int | None = Field(default=None, ge=0, le=100)


class RubricBreakdownItem(BaseModel):
    criterion: str
    met: bool
    comment: str


class RefactorJudgeResult(BaseModel):
    score: int = Field(ge=0, le=100)
    passed: bool
    feedback: str
    rubric_breakdown: list[RubricBreakdownItem]


class VerifyQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    correct: bool
    challenge_type: str
    score: int | None = None
    feedback: str | None = None
    rubric_breakdown: list[RubricBreakdownItem] | None = None
    experience_points: int
    health_points: int
    health_next_regen_at: datetime | None
