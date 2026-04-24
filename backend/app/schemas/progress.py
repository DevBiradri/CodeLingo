from pydantic import BaseModel, Field


class ExperienceGrantRequest(BaseModel):
    amount: int = Field(gt=0, le=10_000)
