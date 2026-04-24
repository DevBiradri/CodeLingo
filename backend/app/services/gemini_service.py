from __future__ import annotations

import json

import httpx
from fastapi import HTTPException, status

from backend.app.core.config import Settings
from backend.app.schemas.question import (
    GeneratedQuestion,
    GenerateQuestionRequest,
    RefactorJudgeResult,
)

QUESTION_GENERATION_SYSTEM_PROMPT = """Role: You are the \"CodeQuest Curriculum Lead.\" Your goal is to generate high-quality, bite-sized programming challenges based on a specific node in a skill map.

Input Context:
You will be provided with:

    Main Topic: (e.g., \"Conditionals\")

    Subtopic: (e.g., \"Ternary Operators\")

    Educational Tip: The core concept to be reinforced.

Challenge Design Philosophy:

    Progression: If the topic is early in the map (e.g., Variables), keep syntax simple. If it is late (e.g., Concurrency), use production-grade code patterns.

    No Lore: Focus on clean, professional, and modern coding standards (Python/JavaScript preferred).

    Refactor Tasks: Focus on real-world \"smells\"-unnecessary nesting, poor naming, or inefficient logic.

    Distractors: In multiple-choice or drag-and-drop, distractors should represent common student misconceptions (e.g., off-by-one errors or scope confusion).

Output Instructions:

    Return ONLY the JSON object.

    Ensure all code snippets are properly escaped for JSON.

    For eval_rubric, provide 3-5 specific technical checks for the LLM Judge."""

REFACTOR_JUDGE_SYSTEM_PROMPT = """Role: You are the \"CodeQuest Evaluator.\" Your job is to grade a user's code refactoring submission by comparing it against the original messy code and a specific set of evaluation criteria.

Input Context:

    Original Code: The messy/inefficient version provided to the user.

    User Submission: The code the user wrote.

    Evaluation Rubric: A list of technical goals the user was expected to achieve.

    Success Threshold: A numerical score (0-100) required to pass the mission.

Grading Logic:

    Logic Preservation: Does the user's code still perform the same function as the original? If the logic is broken, the score cannot exceed 30.

    Rubric Adherence: Award points for each item in the eval_rubric that is successfully implemented.

    Code Quality: Deduct points for syntax errors or introducing new \"smells.\"

    Tone: Provide a short, constructive \"Mentor Note.\" Keep it professional, encouraging, and concise (max 2 sentences).

Output Format:
You MUST return a JSON object with the following structure:
{
  \"score\": \"integer (0-100)\",
  \"passed\": \"boolean\",
  \"feedback\": \"string (The Mentor Note)\",
  \"rubric_breakdown\": [
    {
      \"criterion\": \"string (The item from the rubric)\",
      \"met\": \"boolean\",
      \"comment\": \"string (Briefly why or why not)\"
    }
  ]
}"""


class GeminiService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def generate_question(
        self, payload: GenerateQuestionRequest
    ) -> GeneratedQuestion:
        user_prompt = (
            f"Main Topic: {payload.main_topic}\n"
            f"Subtopic: {payload.subtopic}\n"
            f"Educational Tip: {payload.educational_tip}\n"
        )
        raw = await self._generate_json(
            model=self.settings.gemini_generation_model,
            system_prompt=QUESTION_GENERATION_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        return GeneratedQuestion.model_validate(raw)

    async def judge_refactor(
        self,
        *,
        original_code: str,
        user_submission: str,
        evaluation_rubric: list[str],
        success_threshold: int,
    ) -> RefactorJudgeResult:
        user_prompt = (
            "Original Code:\n"
            f"{original_code}\n\n"
            "User Submission:\n"
            f"{user_submission}\n\n"
            "Evaluation Rubric:\n"
            f"{json.dumps(evaluation_rubric)}\n\n"
            f"Success Threshold: {success_threshold}\n"
        )
        raw = await self._generate_json(
            model=self.settings.gemini_judge_model,
            system_prompt=REFACTOR_JUDGE_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        return RefactorJudgeResult.model_validate(raw)

    async def _generate_json(
        self, *, model: str, system_prompt: str, user_prompt: str
    ) -> dict:
        if not self.settings.gemini_api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Gemini API key is not configured",
            )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        payload = {
            "system_instruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json",
            },
        }

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                url,
                params={"key": self.settings.gemini_api_key},
                json=payload,
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini request failed",
            )

        data = response.json()
        text = self._extract_text_response(data)
        return self._parse_json(text)

    def _extract_text_response(self, payload: dict) -> str:
        candidates = payload.get("candidates", [])
        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini returned no candidates",
            )
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini returned no content",
            )
        text = parts[0].get("text")
        if not text:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini returned empty content",
            )
        return text

    def _parse_json(self, text: str) -> dict:
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            if "```" in text:
                stripped = text.replace("```json", "").replace("```", "").strip()
                try:
                    return json.loads(stripped)
                except json.JSONDecodeError as exc:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Gemini returned invalid JSON",
                    ) from exc
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini returned invalid JSON",
            )
