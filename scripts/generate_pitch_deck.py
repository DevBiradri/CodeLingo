import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

def create_pitch_deck():
    prs = Presentation()

    # Define some colors for the "Neobrutalist" feel (placeholders)
    PINK = RGBColor(255, 0, 255)
    YELLOW = RGBColor(255, 215, 0)
    CYAN = RGBColor(0, 255, 255)
    BLACK = RGBColor(0, 0, 0)

    slides_data = [
        {
            "title": "CodeLingo",
            "subtitle": "Learn Code by Doing\nGamified. Interactive. AI-Powered.",
            "type": "title"
        },
        {
            "title": "The Problem",
            "content": [
                "Traditional coding education is static and boring.",
                "No immediate feedback loops for beginners.",
                "High barrier to entry leading to imposter syndrome."
            ],
            "placeholder": "Screenshot of a boring tutorial vs. a 'Game Over' screen"
        },
        {
            "title": "The Solution: CodeLingo",
            "content": [
                "The Duolingo for Developers.",
                "Gamified: Hearts, XP, Streaks, and Levels.",
                "Interactive: Stop watching, start typing.",
                "AI-Powered: Dynamic challenges that adapt to you."
            ],
            "placeholder": "Collage of Map and Challenge screens"
        },
        {
            "title": "A Structured Roadmap",
            "content": [
                "Visual Skill Tree roadmap.",
                "Unlockable nodes for Python, JavaScript, and more.",
                "Progress tracking at every step."
            ],
            "placeholder": "Screenshot of the Skill Tree Map (/map)"
        },
        {
            "title": "Multi-Modal Learning",
            "content": [
                "Predict Output: Logic comprehension challenges.",
                "Drag & Drop: Visual syntax building.",
                "AI Refactor: Real-world editing with AI evaluation."
            ],
            "placeholder": "Screenshot of the Challenge Editor (/challenge)"
        },
        {
            "title": "AI Integration (Gemini 2.0)",
            "content": [
                "AI generates unique challenges on the fly.",
                "Intelligent grading with nuanced feedback.",
                "Personalized learning path based on performance."
            ],
            "placeholder": "Diagram: User Code -> Gemini API -> Feedback"
        },
        {
            "title": "Retention & Gamification",
            "content": [
                "Streaks: Psychological hook for daily habits.",
                "Leaderboards: Social competition and status.",
                "Health System: Encourages precision and focus."
            ],
            "placeholder": "Screenshot of Leaderboard and Profile stats"
        },
        {
            "title": "Technical Stack",
            "content": [
                "Frontend: Next.js 15, Tailwind CSS, Monaco Editor.",
                "Backend: FastAPI, SQLAlchemy, SQLite.",
                "AI: Google Gemini 2.0 Flash."
            ],
            "placeholder": "Tech Stack Icons/Diagram"
        },
        {
            "title": "The Future Vision",
            "content": [
                "Project-based learning modules.",
                "Multi-player 'Code Duels'.",
                "Enterprise/Team training portals."
            ],
            "placeholder": "Mockup of a Project dashboard"
        },
        {
            "title": "Join the Revolution",
            "subtitle": "Let's fix the way the world learns to code.\n\nContact: your@email.com\nWebsite: codelingo.app",
            "type": "title"
        }
    ]

    for data in slides_data:
        if data.get("type") == "title":
            slide_layout = prs.slide_layouts[0]
            slide = prs.slides.add_slide(slide_layout)
            title = slide.shapes.title
            subtitle = slide.placeholders[1]
            title.text = data["title"]
            subtitle.text = data["subtitle"]
        else:
            slide_layout = prs.slide_layouts[1] # Bullet point layout
            slide = prs.slides.add_slide(slide_layout)
            
            # Title
            title = slide.shapes.title
            title.text = data["title"]
            
            # Content
            body_shape = slide.placeholders[1]
            tf = body_shape.text_frame
            for point in data["content"]:
                p = tf.add_paragraph()
                p.text = point
                p.level = 0

            # Image Placeholder Rectangle
            if "placeholder" in data:
                left = Inches(5.5)
                top = Inches(1.5)
                width = Inches(3.5)
                height = Inches(4.5)
                
                shape = slide.shapes.add_shape(
                    1, # Rectangle
                    left, top, width, height
                )
                shape.fill.solid()
                shape.fill.fore_color.rgb = RGBColor(240, 240, 240)
                shape.line.color.rgb = BLACK
                shape.line.width = Pt(2)
                
                tx_box = slide.shapes.add_textbox(left, top + height/2 - Inches(0.5), width, Inches(1))
                tf = tx_box.text_frame
                tf.text = f"[ {data['placeholder']} ]"
                tf.paragraphs[0].alignment = PP_ALIGN.CENTER

    output_path = "CodeLingo_Pitch_Deck.pptx"
    prs.save(output_path)
    print(f"Success! Pitch deck created at: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_pitch_deck()
