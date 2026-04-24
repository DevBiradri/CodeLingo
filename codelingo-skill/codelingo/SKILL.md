---
name: codelingo
description: Development guide for CodeLingo, a gamified AI/ML learning platform ("Duolingo for Code"). Use this when building, modifying, or architecting features, managing the 4-person parallel workflow, or generating AI-driven lesson content.
---

# CodeLingo

## Overview
CodeLingo is a story-driven, gamified AI and ML learning platform modeled after Duolingo's bite-sized, interactive challenge structure. It uses LLMs for dynamic scenario generation ("Scenario Alchemist") to transform technical lessons into immersive lores (Cyberpunk, Space, Medieval).

## Core Methodology
- **Gamification:** Hearts (lives), Streaks, XP, and a vertical Skill Tree.
- **Bite-Sized Challenges:** Parsons Problems, Fill-in-the-blank, Output Predictors, and Tiny Sandboxes.
- **Interactive Lab:** Real-time ML visualizers (e.g., neuron weight sliders, decision boundary graphs).
- **AI Lore Engine:** LLMs generate themed narratives and personalized feedback based on JSON lesson metadata.

## 4-Person Parallel Workflow
To maximize efficiency, the project is divided into four distinct roles that work against a shared data contract.

1. **Architect & AI Orchestrator (Backend):** FastAPI/Node.js, AI Prompt Engineering, Evaluation Logic, Database (Supabase).
2. **Game Director (Frontend State):** Skill Tree (Map), Global State (Hearts/XP), Leveling Logic, Onboarding.
3. **Interaction Engineer (Lesson Engine):** Reusable `<Challenge />` components, `LessonProvider`, Feedback UI.
4. **Visuals & ML Specialist (Wow Factor):** Interactive ML Visualizers (D3.js), Lore-based CSS Themes, Framer Motion animations.

## Key Resources
- **[Methodology & Challenges](references/methodology.md):** Deep dive into challenge types and game mechanics.
- **[Screen Specifications](references/screens.md):** Detailed UI/UX prompts for AI-driven design tools.
- **[Data Contract (JSON)](references/data-contract.md):** The schema for AI-generated lessons and API specs.

## Usage
- When **adding features**, refer to the specific Role in the workflow.
- When **generating content**, use the JSON schema in `data-contract.md`.
- When **designing UI**, use the prompts in `screens.md`.
