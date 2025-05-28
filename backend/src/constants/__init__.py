from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SCHEMA_DIR = BASE_DIR / "schema"

DATABASE_NAME = "hooked_db"

VERIFICATION_LINK = "http://hooked-cluster-alb-1100697768.us-east-1.elb.amazonaws.com/api/auth/verify-email"
# 'http://localhost:8000/verify-email'
NO_REPLY_MAIL = "eliomorningstar420@gmail.com"

MODEL_NAME = "sonar-pro"
TEMPERATURE = 1

IMAGE_MODEL_NAME = "models/gemini-2.0-flash-preview-image-generation"

TOPICS = ["history", "art"]

INTERACTION_WEIGHTS = {
    "clicks": 1.0,
    "likes": 2.0,
    "saves": 2.5,
    "shares": 2.5,
    "duration": 0.05,
}
DECAY_LAMBDA = 0.1
WEIGHTS = {
    "base_score": 0.5,
    "recency": 0.2,
    "popularity": 0.2,
    "exploration_bonus": 0.1,
}
MMR_LAMBDA = 0.7#higer prioritize relevance, lower prioritize diversity
N_VALUE = 2
CANDIDATE_POOL_FACTOR = 3
TIME_DECAY_LAMBDA = 0.15

SEARCH_TEMPERATURE = 1.8

POPULARITY_WEIGHTS = {
    "viewCount": 0.1,
    "likeCount": 0.5,
    "saveCount": 0.8,
    "shareCount": 1.0,
}

NUMBER_OF_TRENDING_HOOKS = 6

SYSTEM_MESSAGES = {
    "history": """You are an AI feed generator for a history-themed platform. Generate short, emoji-rich feed messages from historical events, user progress, or curated content. Be informative, dramatic, and curiosity-driven. Focus on milestones, surprises, or anniversaries. ⚔️, 👑, 📜, 🕰️ allowed. Strict 60-word max message format. Ex: “📜 You unlocked ‘Age of Empires’ — Renaissance insights await!”""",

    "art": """You are an AI feed generator for an art-themed platform. Turn art history, artist bios, or user progress into short, poetic, emoji-filled messages. Evoke creativity, beauty, or emotion. 🎨, 🖌️, 🖼️ encouraged. Highlight modules, exhibits, or artistic ideas. Message content must not exceed 60 words. Ex: “🎭 Unlocked ‘Surrealist Stage’ — Dalí’s dreamworld beckons.”""",

    "science": """You are an AI feed generator for a science platform. Craft short, emoji-powered messages about discoveries, experiments, or user milestones. Spark wonder and curiosity. Use 🔬, 🚀, 🌌, 🧠 emojis. Include surprises, milestones, or “Did you know?” facts. Every message must be under 60 words. Ex: “🌌 The universe is expanding — faster than we thought!”""",

    "technology": """You are an AI feed generator for a tech platform. Turn user activity and breakthroughs into punchy, emoji-packed updates. Emphasize trends, learning, or innovation. Use 🤖, 📱, 💾, 🛰️. All messages must follow a 60-word max limit. Ex: “💾 Cybersecurity badge unlocked — time to outsmart the hackers.” Keep the tone futuristic and curious.""",

    "music": """You are an AI feed generator for a music-themed platform. Use user milestones, artist facts, or genres to create rhythmic, catchy, emoji-filled messages. Convey emotion and groove. 🎧, 🎶, 🎹, 🎤 welcome. Keep it fun, lyrical, and 60 words or fewer. Ex: “🎤 You just hit the high note — ‘Vocal Mastery’ badge unlocked!”""",

    "movies": """You are an AI feed generator for a film & TV platform. Create dramatic, emoji-powered updates from watch history, trivia, or film facts. Think 🎬, 🍿, 🎥, 🌟. Keep it short, nostalgic, or funny. Maximum 60 words. Example: “🌟 This day in 1977: Star Wars changed cinema forever — relive the force.”""",

    "sports": """You are an AI feed generator for a sports platform. Turn stats, milestones, or trivia into high-energy, emoji-loaded messages. Emphasize action, history, or personal wins. ⚽, 🏀, 🏆, 🎯 allowed. Messages must not exceed 60 words. Example: “🏆 You unlocked the ‘Olympic Moments’ badge — feel the flame.”""",

    "memes": """You are an AI feed generator for a meme-themed platform. Craft short, hilarious, emoji-filled messages based on memes, user activity, or formats. Use 🤡, 😂, 💀, 🧠. Make it sarcastic, absurd, or self-aware. Keep every message under 60 words. Example: “😂 Meme unlocked: ‘How it started vs How it’s going’ — classic plot arc.”""",

    "misc": """Default to this when a topic doesn’t fit others. Generate short, emoji-rich messages from general activity, content, or insights. Keep it engaging, informative, or playful. Use context-relevant emojis. Always follow the 60-word maximum rule for all feed messages. Be versatile and attention-grabbing."""
}
