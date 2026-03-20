#!/usr/bin/env python3
"""
🏛️ OINIO Memorial AI Generator
AI-powered memorial content generation for the OINIO Soul System

Generates personalized memorial narratives, poems, and commemorative content
using Azure AI services integrated with the Quantum Resonance Engine.
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("memorial_ai_generator")

@dataclass
class MemorialProfile:
    """Memorial profile data structure"""
    name: str
    birth_date: Optional[str] = None
    passing_date: Optional[str] = None
    relationship: Optional[str] = None
    personality_traits: List[str] = None
    achievements: List[str] = None
    favorite_memories: List[str] = None
    legacy_message: Optional[str] = None

    def __post_init__(self):
        if self.personality_traits is None:
            self.personality_traits = []
        if self.achievements is None:
            self.achievements = []
        if self.favorite_memories is None:
            self.favorite_memories = []

class OinioMemorialAIGenerator:
    """AI-powered memorial content generator"""

    def __init__(self):
        self.client = None
        self.endpoint = os.getenv("AZURE_AI_ENDPOINT")
        self.key = os.getenv("AZURE_AI_KEY")
        self.model = os.getenv("AZURE_AI_MODEL", "gpt-4o")

        if self.endpoint and self.key:
            self.client = ChatCompletionsClient(
                endpoint=self.endpoint,
                credential=AzureKeyCredential(self.key)
            )
            logger.info("✅ Memorial AI Generator initialized with Azure AI")
        else:
            logger.warning("⚠️ Azure AI credentials not found - running in demo mode")

    async def generate_memorial_narrative(self, profile: MemorialProfile) -> str:
        """Generate a personalized memorial narrative"""
        if not self.client:
            return self._generate_demo_narrative(profile)

        system_prompt = """You are a compassionate AI memorial writer specializing in creating beautiful, respectful commemorative narratives. Your writing should be:

- Warm and comforting
- Respectful of cultural sensitivities
- Focused on celebrating life and legacy
- Appropriate for all ages
- Between 300-600 words
- Structured with introduction, life highlights, impact on others, and legacy

Write in a gentle, poetic style that honors the person's memory while bringing comfort to those who grieve."""

        user_prompt = f"""Create a memorial narrative for:

Name: {profile.name}
Born: {profile.birth_date or 'Unknown'}
Passed: {profile.passing_date or 'Recently'}
Relationship to memorial creator: {profile.relationship or 'Loved one'}

Personality: {', '.join(profile.personality_traits) if profile.personality_traits else 'Kind and loving'}
Achievements: {', '.join(profile.achievements) if profile.achievements else 'Touched many lives'}
Memories: {', '.join(profile.favorite_memories) if profile.favorite_memories else 'Cherished moments shared'}
Legacy message: {profile.legacy_message or 'Remembered with love'}

Please write a beautiful memorial narrative that captures their spirit and impact."""

        try:
            response = self.client.complete([
                SystemMessage(content=system_prompt),
                UserMessage(content=user_prompt)
            ])

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            return self._generate_demo_narrative(profile)

    async def generate_memorial_poem(self, profile: MemorialProfile) -> str:
        """Generate a commemorative poem"""
        if not self.client:
            return self._generate_demo_poem(profile)

        system_prompt = """You are a poet specializing in memorial poetry. Create verses that are:

- Comforting and uplifting
- 12-20 lines long
- Rhyming or free verse as appropriate
- Focused on love, memory, and peace
- Suitable for reading at memorials or sharing with family"""

        user_prompt = f"""Write a memorial poem for {profile.name}, who was known for: {', '.join(profile.personality_traits[:3]) if profile.personality_traits else 'their loving spirit'}.

Include themes of: {', '.join(profile.favorite_memories[:2]) if profile.favorite_memories else 'cherished memories and eternal love'}."""

        try:
            response = self.client.complete([
                SystemMessage(content=system_prompt),
                UserMessage(content=user_prompt)
            ])

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Poem generation failed: {e}")
            return self._generate_demo_poem(profile)

    async def generate_memorial_reflection(self, profile: MemorialProfile, contributor_name: str) -> str:
        """Generate a personal reflection from a contributor's perspective"""
        if not self.client:
            return self._generate_demo_reflection(profile, contributor_name)

        system_prompt = """You are writing a personal reflection as if from a family member or friend. The reflection should be:

- Authentic and emotional
- 150-300 words
- Include specific memories and feelings
- Express love and gratitude
- End on a note of peace or continued connection"""

        user_prompt = f"""Write a personal reflection from {contributor_name}'s perspective about {profile.name}.

Key details:
- Their relationship: {profile.relationship or 'Close family member'}
- Shared memories: {', '.join(profile.favorite_memories[:2]) if profile.favorite_memories else 'Special moments together'}
- What they meant: {profile.legacy_message or 'Everything to me'}

Write as if {contributor_name} is sharing their heart at a memorial service."""

        try:
            response = self.client.complete([
                SystemMessage(content=system_prompt),
                UserMessage(content=user_prompt)
            ])

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Reflection generation failed: {e}")
            return self._generate_demo_reflection(profile, contributor_name)

    def _generate_demo_narrative(self, profile: MemorialProfile) -> str:
        """Generate demo narrative when AI is unavailable"""
        return f"""In loving memory of {profile.name}

{profile.name} touched our lives in ways that words can barely express. Born {profile.birth_date or 'into this world'}, they brought joy, wisdom, and compassion to everyone they met.

{profile.name} was known for their {', '.join(profile.personality_traits) if profile.personality_traits else 'gentle spirit and loving heart'}. Their achievements - {', '.join(profile.achievements) if profile.achievements else 'the lives they touched'} - continue to inspire us all.

We cherish the memories of {', '.join(profile.favorite_memories) if profile.favorite_memories else 'time spent together'}. Though they are no longer with us physically, their spirit lives on in our hearts.

{profile.legacy_message or 'May their memory be a blessing to all who knew them.'}

Forever in our hearts, {profile.name}."""

    def _generate_demo_poem(self, profile: MemorialProfile) -> str:
        """Generate demo poem when AI is unavailable"""
        return f"""Remembering {profile.name}

In the quiet moments when we think of you,
Your smile appears, your laughter rings true.
The love you gave, the joy you brought,
In our hearts forever, never forgot.

Through every season, through joy and pain,
Your spirit guides us, like gentle rain.
Though you've journeyed to the other shore,
Your love remains forevermore.

Rest in peace, dear {profile.name},
Your memory brings comfort, eases the pain."""

    def _generate_demo_reflection(self, profile: MemorialProfile, contributor_name: str) -> str:
        """Generate demo reflection when AI is unavailable"""
        return f"""A reflection from {contributor_name}

{profile.name} was my {profile.relationship or 'dear friend'}, and losing them has left a void in my heart that can never be filled. I remember the times we shared - {', '.join(profile.favorite_memories[:2]) if profile.favorite_memories else 'the laughter, the conversations, the quiet moments'}.

What I miss most is their {', '.join(profile.personality_traits[:2]) if profile.personality_traits else 'gentle wisdom and loving presence'}. They taught me so much about life, love, and what truly matters.

Though they're gone from this world, their influence continues to shape who I am. I carry their memory with me every day, and I know they're watching over us with love.

Rest in peace, {profile.name}. You will never be forgotten."""

# Global instance for use across the application
memorial_ai = OinioMemorialAIGenerator()

async def generate_complete_memorial_package(profile: MemorialProfile, contributor_name: str = "Loved One") -> Dict[str, str]:
    """Generate a complete memorial package with narrative, poem, and reflection"""
    logger.info(f"Generating memorial package for {profile.name}")

    narrative = await memorial_ai.generate_memorial_narrative(profile)
    poem = await memorial_ai.generate_memorial_poem(profile)
    reflection = await memorial_ai.generate_memorial_reflection(profile, contributor_name)

    return {
        "narrative": narrative,
        "poem": poem,
        "reflection": reflection,
        "generated_at": datetime.now().isoformat(),
        "profile": {
            "name": profile.name,
            "birth_date": profile.birth_date,
            "passing_date": profile.passing_date,
            "relationship": profile.relationship
        }
    }

if __name__ == "__main__":
    # Demo usage
    async def demo():
        profile = MemorialProfile(
            name="Eleanor Rose",
            birth_date="March 15, 1945",
            passing_date="December 20, 2025",
            relationship="Grandmother",
            personality_traits=["kind", "wise", "loving", "strong"],
            achievements=["raised five children", "volunteered at church", "master gardener"],
            favorite_memories=["Sunday dinners", "garden walks", "grandchildren's laughter"],
            legacy_message="Love each other as I loved you"
        )

        package = await generate_complete_memorial_package(profile, "Sarah Johnson")
        print(json.dumps(package, indent=2))

    asyncio.run(demo())