# [🎣 HookED – Learning That Slaps](https://siddharthkarmokar.github.io/hooked-app/)

*A gamified microlearning app for neurodivergent minds and curiosity-driven learners—powered by the Perplexity Sonar API.*

---

## 🌟 Inspiration

After navigating burnout, anxiety, and information overload during my academic journey—and watching how traditional education fails to meet diverse learning needs—I realized that the lessons that truly stuck with me weren’t from textbooks. They came from stories, analogies, and real-life connections.

I also saw how people—especially those with ADHD, short attention spans, or academic pressure—struggled to stay engaged with text-heavy formats. They needed microlearning that’s rewarding, visual, and low-pressure. That’s when it hit me:

**What if learning felt like scrolling TikTok—but actually made you smarter?**
That spark led to HookED—an app that delivers real-time, story-driven microlearning powered by the Perplexity Sonar API.

---

## 🚀 What It Does

**HookED** turns any topic into a learning adventure. Type in a topic—like “AI in music” or “Napoleon’s fall”—and HookED fetches:

* A 60-word real-world “hook” (powered by Perplexity Sonar API)
* Sources of information
* A quick quiz question to reinforce what you learned
* Optional: A deeper *Hook Quest*—a 5 step journey into related topics

As users complete quests and quizzes, they earn XP, unlock badges, and build streaks—all while learning in short, dopamine-friendly bursts.

---

## 🏗️ How We Built It

| Component      | Technology Used              | Purpose                                                          |
| -------------- | ---------------------------- | ---------------------------------------------------------------- |
| Mobile App     | React Native                 | Custom UI for onboarding, search, quizzes, Hook Feed, and quests |
| Backend        | Python + FastAPI             | Handles routing, XP logic, profile management, and API requests  |
| Database       | MongoDB Atlas                | Stores users, XP, history, quest states, and badge data          |
| AI Integration | Perplexity Sonar API         | Generates real-time 60-word hooks, analogies, and citations      |
| Visual Engine  | Langchain + Gemini 2.0 Flash | Generates fun visuals for quests and learning reinforcement      |
| Hosting        | AWS                          | Deployed backend and database using cloud infrastructure         |

---

## 🤖 How is Perplexity Sonar API Used?

HookED integrates the **Perplexity Sonar Pro API** to generate real-time, engaging educational content for Gen Z users. Here's how it's used:

### 🧩 Purpose

* To generate **bite-sized educational hooks**, analogies, quizzes, and riddles based on **current trends**.
* To output structured **JSON content** ready for rendering in the app as feeds or quests.

### ⚙️ Integration Flow

1. **Prompt Templating**
   Langchain is used to format prompts with both system-level instructions and dynamic user inputs (e.g., “Explain inflation using Gen Z lingo”).

2. **Structured Output with Schema**
   The Sonar Pro API is called with a defined output schema (hook, analogy, quiz, riddle), ensuring responses are developer-friendly JSON.

3. **Fallback Parsing**
   If the response isn't valid JSON, a custom parser (`extract_valid_json`) intelligently strips markdown/code blocks and extracts the valid JSON portion.

4. **Real-Time Feed + Quest Creation**
   The structured response is used to create:

   * **Feed Cards** – Trending facts, analogies, and insights.
   * **HookQuests** – Gamified learning modules with quizzes and riddles.

### 📈 Why Sonar Pro?

* Trained on **real-time web data** for hyper-relevant results.
* Handles **informal, meme-like prompts** better than traditional models.
* Perfect for **short attention span learners** who prefer quick, fun learning formats.

---

## 🚧 Challenges We Ran Into

**🧠 Turning Hooks into Hits**
Cleaning up AI outputs into crisp, 60-word insights wasn’t easy. We spent hours refining language, trimming fluff, and making sure each hook wasn’t just accurate—but instantly engaging.

**🎯 Quizzes Weren’t Plug-and-Play**
We couldn’t just drop in AI-generated questions. We had to build logic that could interpret loosely structured responses and transform them into meaningful, balanced multiple-choice quizzes.

**🎮 Designing for Dopamine, Not Distraction**
Creating a scrollable UI that balances fun, focus, and feedback—especially for neurodiverse users—meant lots of iteration. Every tap and transition had to feel intentional.

**🧩 HookQuests Needed Story, Not Just Structure**
Users don’t learn in fragments. We built custom clustering logic to connect separate searches into a narrative arc, making each quest feel like a journey—not a jumble.

**🔗 Sonar ≠ Chain-of-Thought... At First**
Sonar Pro wasn’t built for deep reasoning, so we hacked around it—literally. A GitHub-thread-inspired method let us simulate chain-of-thought logic, giving users smarter, more layered responses.

**🎙️ Prompt Engineering = Full-Time Job**
We fine-tuned dozens of prompts to get the right tone, structure, and analogy depth. It took serious trial-and-error, but getting it “just right” made all the difference.

**🧮 Algorithms Under Pressure**
From XP systems to badge logic and learning path generation, we built custom flows in real time. It pushed us technically—and made the end result that much more rewarding.


---

## 🏆 Accomplishments That We're Proud Of

* **Designed a learning app for real cognitive needs**—especially for users with ADHD, anxiety, or short attention spans.
* **Integrated real-time AI content** into a gamified mobile app.
* **Built Hook Quests**—personalized, theme-based learning journeys using search history and analogical thinking.
* **Crafted a smooth UI** that feels like TikTok for knowledge—lightweight, intuitive, and addictive (in a good way).
* **Turned LLM outputs into structured, quizable knowledge** with XP, streaks, and storylines.

---

## 🧠 What We Learned

* **LLMs are powerful—but unpredictable**
  We learned to prompt, debug, and adapt to a constantly evolving API.

* **Designing for neurodivergent users is all about empathy**
  From visuals to feedback, everything needed to reduce overwhelm and increase emotional safety.

* **Gamification needs to feel earned**
  XP and badges only motivate when they align with meaningful progress.

* **React Native + FastAPI are a great match**
  Fast iteration with smooth mobile/backend integration.

* **AI text → structured logic takes creativity**
  Whether it’s extracting APA citations or building a quiz, LLM output always needs smart post-processing.

---

## 🔮 What’s Next for HookED

* **Hook History & Recommendations** – Let users revisit topics and get personalized suggestions based on past learning.
* **Social Learning** – Enable study squads, shared Hook Quests, and community leaderboards.
* **Advanced Quiz Engine** – Use GPT-style models to generate context-aware, multi-step quizzes dynamically.
* **Mood-Based Hooking** – Let users input their mood and receive emotionally resonant learning hooks.
* **Offline Mode + Multilingual Hooks** – Expand accessibility and global reach.

---

## 🎥 Demo Video

📺 [Watch Demo (3 mins)](https://youtu.be/your-demo-link)

---

## 🔒 Repository

[Github](https://github.com/rahulraocoder/hooked-app/)

[Docs](https://siddharthkarmokar.github.io/hooked-app/)

**Shared With:**

* [james.liounis@perplexity.ai](mailto:james.liounis@perplexity.ai)
* [sathvik@perplexity.ai](mailto:sathvik@perplexity.ai)
* [devrel@perplexity.ai](mailto:devrel@perplexity.ai)
* [testing@devpost.com](mailto:testing@devpost.com)

---

## 🏷 Submission Info

* **Category:** Health
* **Bonus Category:** Deep Research
* **Team:** Aishwarya Jakka, Rahul Rao, and Siddarth Karmokar
* **Main Tool Used:** Perplexity Sonar API

---

## 📬 Contact

Created by **Aishwarya Jakka, Rahul Rao, and Siddarth Karmokar**

[aishwaryajakka@gmail.com](mailto:aishwaryajakka@gmail.com)
[siddkarmokar@gmail.com](mailto:siddkarmokar@gmail.com)
[rahulyup@gmail.com](mailto:rahulyup@gmail.com)

---

## 📜 License

MIT License — Open for educational, non-commercial, and community use.
