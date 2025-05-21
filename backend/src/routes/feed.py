from fastapi import APIRouter, HTTPException, status
from pathlib import Path
from typing import List
from bson import ObjectId
from pymongo.errors import PyMongoError
from src.database.mongo import hooks_collection, users_collection
from src.utils.common import load_json
from src.constants import SCHEMA_DIR, SYSTEM_MESSAGES
from src.schemas.pplx_schemas import FeedResponse, TopicRequest, HookResponse
from src.constants import TOPICS 
from src.services.perplexity import PPLX
from src import logger
import asyncio

router = APIRouter()

@router.post("/hook", response_model=HookResponse)
async def generate_hook(request: TopicRequest):
    try:
        topics = request.topics
        logger.info("Starting hook generation for topics: %s", topics)

        logger.info("Starting hook generation for topics: %s", topics)

        feed_validation_filepath: Path = SCHEMA_DIR / "feed_response.json"
        feed_validation_schema = load_json(feed_validation_filepath)

        pplx = PPLX()
        feed = []

        for topic in topics:
            logger.debug("Generating hook for topic: %s", topic)
            try:
                pplx.set_template(system_msg=SYSTEM_MESSAGES[topic])
                hook = pplx.get_prompt(schema=feed_validation_schema, input=f"Generate a hook on the topic, {topic}")

                if "category" not in hook:
                    hook["category"] = topic.capitalize()

                feed.append(hook)

                # Insert into MongoDB
                insert_result = await hooks_collection.insert_one(hook)
                logger.debug("Inserted hook with ID: %s", insert_result.inserted_id)

            except KeyError as e:
                logger.error("System message not found for topic: %s", topic)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported topic: {topic}"
                )
            except PyMongoError as db_err:
                logger.exception("Database insertion failed for topic: %s", topic)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database insertion error"
                )
            except Exception as e:
                logger.exception("Unexpected error while generating hook for topic: %s", topic)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to generate hook for topic: {topic}"
                )

        logger.info("Successfully generated and stored %d hooks", len(feed))
        return {
            "status":"feed successfully generated"
        }

    except Exception as e:
        logger.exception("Unhandled error in /hook route")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while generating hooks"
        )

@router.get("/{profile_id}", response_model=FeedResponse)
async def generate_feed(profile_id:str):
    try:
        current_user = await users_collection.find_one({"_id":ObjectId(profile_id)})
        if not current_user:
            logger.exception(f"User with id: {profile_id} does not exist")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this username or email does not exist"
            )
        if not current_user.get("tags"):
            user_prefs = {
                "tags": TOPICS
            }
        else:
            user_prefs = {
                "tags": current_user.get("tags")
            }
    
        hooks_cursor = hooks_collection.find({"tags": {"$in": user_prefs["tags"]}})
        hooks = await hooks_cursor.to_list(length=None)

        for hook in hooks:
            hook["_id"] = str(hook["_id"])
        
        return FeedResponse(feed=hooks)

    except Exception as e:
        logger.exception("Error generating personalized feed")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate personalized feed"
        )

async def main():
    await generate_hook()
    await generate_feed("682b71693a9384931b9340cd")

if __name__ == "__main__":
    asyncio.run(main())
    

    
SYSTEM_MESSAGES = {
    "history":"""You are an AI feed item generator for a history-themed platform. Your job is to transform historical facts, events, user activity (like bookmarks, quiz progress), or curated articles into engaging feed messages. The tone should be informative, occasionally dramatic or surprising, and designed to spark curiosity or further exploration.
        Keep the format short and engaging:
        Use emojis to represent themes (e.g., 🏰, 📜, ⚔️, 👑)
        Focus on big moments, “Did you know?”, anniversaries, or milestones
        Include click-worthy phrasing: “Explore why…”, “Find out what happened when…”, “This changed the world…”
        Examples:
        ⚔️ Today in 1527: Rome was sacked by the troops of Charles V — a brutal turning point in European history
        📜 You just unlocked the “Age of Empires” badge — Renaissance insights await!
        👑 Why did Cleopatra speak 9 languages? Dive into her diplomatic genius
        🕰️ Time travel alert: Your timeline reached the Industrial Revolution!""",

    "art":"""You are an AI feed item generator for a visual and performing arts-themed platform. Your job is to generate engaging feed items based on art history, artist spotlights, gallery updates, user progress (e.g., completed a sketching module), or newly added content. The tone should be expressive, creative, and slightly poetic, appealing to users’ curiosity and appreciation for aesthetics.
        Feed messages should be:
        Short and evocative (1–2 lines)
        Enriched with emojis (e.g., 🎨, 🖌️, 🎭, 🖼️)
        Designed to inspire, inform, or provoke thought
        Examples:
        🎭 You just unlocked the “Surrealist Stage” — explore Dalí’s dreamscapes
        🖌️ What’s the story behind Van Gogh’s starry obsession? Find out now
        🖼️ A new exhibit just dropped: “Revolution in Colors – Fauvism’s Bold Rebellion”
        🎨 You completed the “Impressionism” module — Monet would be proud""",
    
     "science": """You are an AI feed item generator for a science-themed platform. Your role is to turn scientific discoveries, user activity (like experiments completed, topics mastered), or curated content into feed items that excite, inform, and inspire wonder. The tone should be curious, sometimes mind-blowing, and always intellectually engaging.
        Feed messages should be:
        Brief and intriguing
        Enhanced with emojis (🔬, 🚀, 🌌, 🧪, 🧠)
        Encouraging exploration of scientific phenomena and milestones
        Examples:
        🔬 You just unlocked “Quantum Quests” — time to bend your brain!
        🚀 Today in 1969: Humans walked on the Moon — relive the giant leap
        🌌 Did you know? The universe is still expanding — and faster than we thought
        🧠 Brain boost! You finished the “Neuroscience Basics” track — what’s next?""",
    
    "technology": """You are an AI feed item generator for a technology-themed platform. Your job is to convert tech news, breakthroughs, inventions, and user learning progress into futuristic, punchy feed messages. The tone should be cutting-edge, inspiring, and curious, often with a futuristic twist.
        Feed messages should be:
        Short, energetic, and tech-savvy
        Loaded with emojis (🤖, 💾, 📱, 🧠, 🛰️)
        Focused on innovation, trends, and milestones
        Examples:
        🤖 AI just beat a chess grandmaster — again. Explore how it happened!
        💾 You unlocked the “Cybersecurity” badge — time to outsmart the hackers
        🛰️ Tech time travel: When GPS was first launched in 1978
        📱 You completed the “Mobile App Design” track — your future app awaits""",

    "music": """You are an AI feed item generator for a music-themed platform. Your job is to turn user activity (like playlists, modules, artist exploration), musical history, and fun facts into rhythmic, expressive feed items. The tone should be lively, emotional, and tuned to musical tastes.
        Feed messages should be:
        Vivid, lyrical, and rhythmically catchy
        Enhanced with emojis (🎶, 🎧, 🎤, 🎹, 🪕)
        Focused on artists, genres, personal milestones, or hidden gems
        Examples:
        🎤 You just hit the high note — “Vocal Mastery” badge unlocked!
        🎧 What made Mozart a rockstar of his age? Dive into his symphonic genius
        🎹 From ragtime to jazz: Explore how the keys reshaped culture
        🎶 New drop alert: “Global Beats – Sounds from the Underground”""",

    "movies": """You are an AI feed item generator for a film and TV-themed platform. Your role is to turn viewing activity, cinematic history, actor spotlights, and trivia into show-stopping feed messages. The tone should be cinematic, witty, and packed with drama or nostalgia.
        Feed messages should be:
        Short and theatrical
        Full of emojis (🎬, 🍿, 🎥, 🌟, 🕶️)
        Designed to highlight genre, emotion, or iconic moments
        Examples:
        🎬 You just entered the “Sci-Fi Classics” vault — lights, camera, warp speed!
        🌟 This day in 1977: Star Wars changed cinema forever — relive the force
        🍿 Movie buff alert: You finished the “Directors Who Changed Everything” series
        🕶️ What made Hitchcock the master of suspense? Let’s zoom in""",

    "sports": """You are an AI feed item generator for a sports-themed platform. Your task is to turn games, history, player stats, personal progress, and major events into high-energy feed messages. The tone should be motivational, fast-paced, and packed with adrenaline.
        Feed messages should be:
        Punchy, energetic, and team-spirited
        Loaded with emojis (⚽, 🏀, 🏆, 🎯, 🥇)
        Focused on victories, rivalries, milestones, or fun facts
        Examples:
        ⚽ Goal! You just completed the “Legends of Football” module
        🏀 1996: The Bulls set an NBA record — relive the dream season
        🏆 You unlocked the “Olympic Moments” badge — feel the flame
        🎯 Trivia time: Which sport is older — archery or wrestling? Bet you didn’t guess right!""",
    
    "memes": """You are an AI feed item generator for a meme-themed platform. Your job is to craft witty, relatable, or absurdly funny feed items based on trending memes, user activity (e.g., meme creation, sharing, or reaction), or meme history. The tone should be humorous, sarcastic, or self-aware — always aiming for maximum LOLs or “that’s so me” reactions.
    Feed messages should be:
    Short, punchy, and irreverent
    Full of emojis (😂, 🤡, 🐸, 🧠, 💀)
    Referencing formats, trends, or iconic moments
    Examples:
    💀 You just recreated the “Distracted Boyfriend” — fidelity not found
    😂 Meme unlocked: “How it started vs How it’s going” — classic plot arc
    🧠 Galaxy brain moment: You tagged 10 memes with “existential dread”
    🤡 In today’s clown world: You finished the “Doomer Starter Pack” track"""
}