# 🚀 CodeLingo 

> **Learn Code By Doing.** 
Duolingo for coding, but neobrutalism style.

![CodeLingo Banner](frontend/public/cover.png)

## 🎮 What is CodeLingo?
CodeLingo is a next-generation learning platform designed to make programming fun, engaging, and highly interactive. Built with a stunning **Neobrutalist design**, CodeLingo moves away from boring video tutorials and instead throws you right into the action.

Using **Google's Gemini AI**, CodeLingo dynamically generates bite-sized, language-specific challenges tailored to your progress. Whether you want to learn Python, JavaScript, Go, C++, or Rust, CodeLingo adapts its curriculum to your preferred language on the fly.

---

## ✨ Key Features

### 🌳 The Skill Tree Roadmap
Progress through a massive, 16-level programming skill tree. Start from the absolute basics like **Variables & Memory** and climb your way up to advanced topics like **Algorithms and Concurrency**.

### 🤖 AI-Generated Missions
No hardcoded, stale questions. CodeLingo integrates with **Gemini AI** to generate unique challenges on demand. Every time you tackle a subtopic, you face a fresh set of challenges tailored to your selected system language.

### 🎯 3 Interactive Challenge Modes
1. **Predict Output:** Read a snippet of code and predict exactly what it will output.
2. **Drag & Drop:** Piece together shattered code blocks to build a working script.
3. **Refactor (Built-in Editor):** Write actual code in an integrated Monaco editor to fix or optimize messy code. An **AI Judge** evaluates your code against a strict rubric and provides personalized mentor feedback!

### 🏆 Gamification & Progression
- **XP & Levels:** Earn Experience Points for every correct answer and climb through the ranks (from "Newcomer" to "Architect").
- **Health System (HP):** Don't guess wildly! Wrong answers cost Health Points, which regenerate over time.
- **Leaderboard:** Compete globally with other learners.
- **Streaks:** Keep your daily streak alive to build a coding habit.

---

## 🛠️ Tech Stack

CodeLingo is built using a modern, scalable, and fully asynchronous stack:

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** TailwindCSS (Vanilla CSS tokens for Neobrutalism)
- **Editor:** Microsoft Monaco Editor
- **Icons:** Google Material Symbols

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (via SQLAlchemy async & asyncpg)
- **Authentication:** JWT (JSON Web Tokens) & Passlib (bcrypt)
- **AI Integration:** Google GenAI SDK (Gemini Models)
- **Caching:** In-memory caching for LLM responses to optimize API quotas

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL
- A Google Gemini API Key

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/codelingo
SECRET_KEY=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_key
```

Run the FastAPI server:
```bash
uvicorn backend.app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory (if needed):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Run the Next.js development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🎨 Design Philosophy
We chose a **Neobrutalist** aesthetic—characterized by bold typography, high-contrast colors, harsh shadows, and visible borders—because learning to code should feel active, loud, and exciting, not sterile.

---

## 🤝 Hackathon Submission
Built with ❤️ and 🤖 for the hackathon. 

**Happy Coding!**
