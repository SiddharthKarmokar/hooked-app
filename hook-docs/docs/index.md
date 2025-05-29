# 🎣 HookED – Learning That Slaps

*A gamified microlearning app for neurodivergent minds and curiosity-driven learners—powered by the Perplexity Sonar API.*

---

!!! abstract "In One Line"
    **HookED** turns learning into a real-time, scrollable experience—powered by AI, structured by story, and gamified for curiosity.

## 🌟 Inspiration

> "What if learning felt like scrolling TikTok—but actually made you smarter?"

HookED was born from frustration with traditional learning and a desire to create something that speaks to how people *actually* absorb information—especially those with ADHD, burnout, or short attention spans.

We saw the power of stories, analogies, and visual reinforcement—and paired that with cutting-edge AI to build a new way to learn.

---

## 🚀 What It Does

HookED is a mobile-first app that delivers:

- 📌 **60-word hooks** powered by the Perplexity Sonar API
- 📚 Real-time sources and citations
- 🧠 Instant quizzes to reinforce key ideas
- 🧭 Optional “Hook Quests” for deeper exploration

Along the way, users collect XP, badges, and streaks—making learning feel like leveling up in a game.

---

## 🏗️ Architecture Overview

| Component      | Technology Used              | Purpose                                                          |
| -------------- | ---------------------------- | ---------------------------------------------------------------- |
| Mobile App     | React Native                 | Custom UI for onboarding, search, quizzes, Hook Feed, and quests |
| Backend        | Python + FastAPI             | Routing, XP logic, profile management, and API calls             |
| Database       | MongoDB Atlas                | Stores users, history, XP, quest states, and badge data          |
| AI Engine      | Perplexity Sonar Pro API     | Generates hooks, analogies, citations, and quiz prompts          |
| Visual Layer   | LangChain + Gemini 2.0 Flash | Creates visuals to reinforce learning                            |
| Hosting        | AWS                          | Full-stack deployment                                            |

---

## 🤖 AI Integration Details

!!! info "Perplexity Sonar API: Real-Time Relevance"
    - Trained on **live web data**
    - Handles **informal, meme-like prompts**
    - Outputs structured **developer-friendly JSON**

**Integration Flow:**

1. 🧱 Prompt templating via LangChain  
2. 🧾 Output schema for hook, analogy, quiz, riddle  
3. 🔍 Fallback JSON parser (`extract_valid_json`)  
4. 🧵 Used to generate Feed Cards and HookQuests

See more in [Feed](./feed.md) and [Trending](./trending.md).

---

## 📂 Documentation Sections

Navigate through each key component of the system:

- [🖼 Frontend UI](./frontend.md) – Built with React Native for a buttery-smooth mobile experience.
- [🧠 Backend Logic](./backend.md) – FastAPI-based service for XP, hooks, and user flow.
- [📰 Feed Generation](./feed.md) – How we generate bite-sized learning cards from Sonar responses.
- [📊 Trending Engine](./trending.md) – How popularity scores drive the global trending page.

---

## 🧩 Engineering Challenges

!!! warning "Not Everything Was Plug-and-Play"
    - Hooks had to be carefully trimmed and cleaned to stay below 60 words.
    - Quizzes needed post-processing and logic to balance difficulty.
    - UI needed dopamine without distraction—especially for neurodivergent users.
    - Chain-of-thought logic was simulated via custom thread-like design.

---

## 🏆 Accomplishments

- ✅ AI-powered, real-time educational feed  
- 🎯 Designed for ADHD, anxiety, and cognitive load  
- 🧭 Story-driven “HookQuests”  
- 📱 TikTok-style UI for knowledge  
- 🧠 Turned raw LLM output into structured learning moments  

---

## 📚 Lessons Learned

!!! quote "LLMs are powerful—but unpredictable."
    Prompt engineering is a full-time job. We learned to debug and mold outputs for precision and emotional tone.

- Designing for neurodivergent users means optimizing for safety and clarity.
- Gamification must be **earned**, not forced.
- React Native + FastAPI = fast iteration.
- AI text → structured logic = creative problem solving.

---

## 🔮 What's Next

- 🧠 **Hook History & Recommendations**
- 👥 **Social Learning & Study Squads**
- 🧪 **Contextual Quiz Engine**
- 🎭 **Mood-Based Hooking**
- 🌍 **Offline Mode + Multilingual Support**

---

## 🎥 Demo

📺 [Watch Demo (3 mins)](https://youtu.be/FUO4GSRWHn8?si=zATY-f24oGImC66q)

---

## 🔒 Repository

[GitHub Repo](https://github.com/rahulraocoder/hooked-app/)

[API link](http://hooked-cluster-alb-1100697768.us-east-1.elb.amazonaws.com/docs)

**Shared With:**
- [james.liounis@perplexity.ai](mailto:james.liounis@perplexity.ai)  
- [sathvik@perplexity.ai](mailto:sathvik@perplexity.ai)  
- [devrel@perplexity.ai](mailto:devrel@perplexity.ai)  
- [testing@devpost.com](mailto:testing@devpost.com)

---

## 🏷 Submission Info

**Category:** Education, Health, Fun and Creative  
**Bonus:** Deep Research  
**Team:** Aishwarya Jakka, Rahul Rao, Siddarth Karmokar  
**Main Tool:** Perplexity Sonar API

---

## 📬 Contact

Created by:

- **Siddarth Karmokar** - [siddkarmokar@gmail.com](mailto:siddkarmokar@gmail.com) (backend)
- **Aishwarya Jakka** – [aishwaryajakka@gmail.com](mailto:aishwaryajakka@gmail.com) (ui, ux and management) 
- **Rahul Rao**  - [rahulyup@gmail.com](mailto:rahulyup@gmail.com) (frontend)

---

## 📜 License

MIT License — Open for educational, non-commercial, and community use.
