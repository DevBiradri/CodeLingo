from __future__ import annotations

import json
import asyncio
import logging
import random
import sys
from typing import Any

from google import genai
from google.genai import types
from fastapi import HTTPException, status

from backend.app.core.config import Settings
from backend.app.schemas.question import (
    GeneratedQuestion,
    GenerateQuestionRequest,
    RefactorJudgeResult,
)

# Setup logger
logger = logging.getLogger("gemini_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter('%(levelname)s:     %(message)s'))
    logger.addHandler(handler)

CHALLENGE_TYPES = [
    'type: "predict_output"\n   Fields: instruction, code_snippet, options (list of 4), correct_answer (string from options)',
    'type: "drag_and_drop"\n   Fields: instruction, code_with_blanks (use __placeholder__), options (list), solution (object mapping placeholders to values)',
    'type: "refactor"\n   Fields: instruction, initial_code (messy code), eval_rubric (list of strings)'
]

QUESTION_GENERATION_SYSTEM_PROMPT_TEMPLATE = """Role: You are the "CodeLingo Curriculum Lead." Your goal is to generate high-quality, bite-sized programming challenges.

You MUST generate a challenge of the following type:
{selected_challenge_type}

You MUST return a JSON object with this EXACT structure:
{{
  "challenge_id": "string-uuid",
  "topic_context": "narrative description",
  "difficulty_score": 5,
  "challenges": [
    {{
      "type": "SELECTED_TYPE",
      ... (include all fields specific to the selected type)
    }}
  ]
}}

IMPORTANT: Return ONLY the raw JSON. No markdown, no preamble."""

REFACTOR_JUDGE_SYSTEM_PROMPT = """Role: You are the \"CodeQuest Evaluator.\"
Return a JSON object with this EXACT structure:
{
  "score": 85,
  "passed": true,
  "feedback": "Mentor note",
  "rubric_breakdown": [
    {"criterion": "string", "met": true, "comment": "string"}
  ]
}"""

class GeminiService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        if not self.settings.gemini_api_key:
            self.client = None
        else:
            self.client = genai.Client(api_key=self.settings.gemini_api_key)

    async def generate_question(self, payload: GenerateQuestionRequest) -> GeneratedQuestion:
        user_prompt = f"Topic: {payload.main_topic}\nSubtopic: {payload.subtopic}\nTip: {payload.educational_tip}"
        selected_type = random.choice(CHALLENGE_TYPES)
        system_prompt = QUESTION_GENERATION_SYSTEM_PROMPT_TEMPLATE.format(selected_challenge_type=selected_type)
        raw = await self._generate_simple_json(
            model=self.settings.gemini_generation_model,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.7
        )
        question = GeneratedQuestion.model_validate(raw)
        question.subtopic = payload.subtopic
        return question

    async def judge_refactor(self, *, original_code: str, user_submission: str, evaluation_rubric: list[str], success_threshold: int) -> RefactorJudgeResult:
        user_prompt = f"Original: {original_code}\nSubmission: {user_submission}\nRubric: {evaluation_rubric}\nThreshold: {success_threshold}"
        raw = await self._generate_simple_json(
            model=self.settings.gemini_judge_model,
            system_prompt=REFACTOR_JUDGE_SYSTEM_PROMPT,
            user_prompt=user_prompt
        )
        return RefactorJudgeResult.model_validate(raw)

    async def _generate_simple_json(self, *, model: str, system_prompt: str, user_prompt: str, temperature: float = 0.1) -> dict[str, Any]:
        if not self.client:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")

        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=temperature,
                    response_mime_type="application/json",
                ),
            )
            
            if not response or not response.text:
                raise HTTPException(status_code=502, detail="Gemini returned empty response")
            
            logger.info(f"Gemini Response: {response.text}")
            
            # Robust parsing for raw text
            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("```json")[-1].split("```")[0].strip()
                
            return json.loads(text)

        except Exception as e:
            logger.error(f"Gemini request failed: {str(e)}")
            raise HTTPException(status_code=502, detail=f"Gemini error: {str(e)}")
