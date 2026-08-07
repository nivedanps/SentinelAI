"""
Antigravity AI Engine Bridge
===============================
Interfaces with the Antigravity AI API for:
1. Zero-shot NLP incident classification
2. Entity & need extraction from distress text
3. Damage severity assessment
4. Command summary generation for operational briefs

Includes a mock fallback for offline/hackathon demo scenarios.
"""

from typing import Dict, Any, List, Optional
import httpx
from app.config import settings
from app.core.logging import get_logger
from app.core.exceptions import AIEngineException

logger = get_logger("ai_engine")


class AIEngine:
    """
    Bridge to the Antigravity AI service for incident text analysis
    and decision support generation.
    """

    def __init__(self):
        self.api_key = settings.ANTIGRAVITY_AI_API_KEY
        self.endpoint = settings.ANTIGRAVITY_AI_ENDPOINT
        self.timeout = 30.0  # seconds

    async def analyze_incident_text(
        self,
        text: str,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Send incident text to AI for structured analysis.
        Falls back to heuristic mock if the AI service is unavailable.
        """
        prompt = self._build_analysis_prompt(text, context)

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.endpoint,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "prompt": prompt,
                        "max_tokens": 500,
                        "temperature": 0.2,
                    },
                )
                response.raise_for_status()
                result = response.json()
                return self._parse_ai_response(result)

        except httpx.HTTPStatusError as e:
            logger.warning(
                "AI API returned error status, using mock fallback",
                status=e.response.status_code,
            )
            return self._mock_analysis(text)

        except (httpx.RequestError, Exception) as e:
            logger.warning(
                "AI API unreachable, using mock fallback",
                error=str(e),
            )
            return self._mock_analysis(text)

    async def generate_command_brief(
        self,
        incidents_summary: Dict[str, Any],
        resource_status: Dict[str, Any],
        weather_data: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        """
        Generate an AI-powered operational command brief
        from aggregated situational data.
        """
        prompt = self._build_brief_prompt(
            incidents_summary, resource_status, weather_data
        )

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.endpoint,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "prompt": prompt,
                        "max_tokens": 800,
                        "temperature": 0.3,
                    },
                )
                response.raise_for_status()
                result = response.json()
                return result

        except Exception as e:
            logger.warning("AI brief generation failed", error=str(e))
            return {
                "operational_summary": "AI brief unavailable. Review manual dashboards.",
                "recommended_priorities": [],
            }

    # ------------------------------------------------------------------
    # Prompt Construction
    # ------------------------------------------------------------------

    @staticmethod
    def _build_analysis_prompt(text: str, context: Optional[str] = None) -> str:
        ctx = f" Context: {context}." if context else ""
        return (
            f"Analyze the following disaster incident report.{ctx}\n\n"
            f'Report: "{text}"\n\n'
            "Respond in JSON with these exact keys:\n"
            "- predicted_category: one of [FLOOD, FIRE, BUILDING_COLLAPSE, "
            "LANDSLIDE, MEDICAL_EMERGENCY, HAZMAT, CYCLONE, EARTHQUAKE, OTHER]\n"
            "- urgency_level: one of [LOW, MEDIUM, HIGH, CRITICAL]\n"
            "- extracted_needs: list of immediate needs [MEDICAL, BOATS, FOOD, "
            "WATER, SHELTER, RESCUE, EVACUATION, POWER]\n"
            "- damage_severity: float 0-10\n"
            "- confidence_score: float 0-1\n"
            "- summary: one-sentence summary\n"
            "- recommended_actions: list of 2-3 recommended response actions"
        )

    @staticmethod
    def _build_brief_prompt(
        incidents: Dict, resources: Dict, weather: Dict = None
    ) -> str:
        weather_section = f"\nWeather: {weather}" if weather else ""
        return (
            "Generate a concise operational command brief for a disaster "
            "management officer based on the following data:\n\n"
            f"Active Incidents: {incidents}\n"
            f"Resource Status: {resources}\n"
            f"{weather_section}\n\n"
            "Include: critical_alerts (list), resource_warnings (list), "
            "operational_summary (string), recommended_priorities (list)"
        )

    # ------------------------------------------------------------------
    # Response Parsing & Mock Fallback
    # ------------------------------------------------------------------

    @staticmethod
    def _parse_ai_response(raw_response: Dict[str, Any]) -> Dict[str, Any]:
        """Parse and validate AI API response into a standard structure."""
        # Handle various AI API response formats
        content = raw_response.get("choices", [{}])[0].get("message", {}).get("content", "")
        if not content:
            content = raw_response.get("result", raw_response.get("text", ""))

        return {
            "predicted_category": raw_response.get("predicted_category", "OTHER"),
            "urgency_level": raw_response.get("urgency_level", "MEDIUM"),
            "extracted_needs": raw_response.get("extracted_needs", []),
            "damage_severity": raw_response.get("damage_severity", 5.0),
            "confidence_score": raw_response.get("confidence_score", 0.5),
            "summary": raw_response.get("summary", content[:200] if content else ""),
            "recommended_actions": raw_response.get("recommended_actions", []),
        }

    @staticmethod
    def _mock_analysis(text: str) -> Dict[str, Any]:
        """
        Heuristic-based mock analysis for offline demo scenarios.
        Keyword matching provides reasonable approximations.
        """
        text_lower = text.lower()

        # Category classification by keyword
        if any(w in text_lower for w in ["flood", "water", "submerged", "drowning"]):
            category = "FLOOD"
            needs = ["BOATS", "RESCUE", "FOOD", "WATER"]
            severity = 7.5
        elif any(w in text_lower for w in ["fire", "burning", "smoke", "blaze"]):
            category = "FIRE"
            needs = ["RESCUE", "MEDICAL", "EVACUATION"]
            severity = 7.0
        elif any(w in text_lower for w in ["collapse", "building", "trapped", "rubble"]):
            category = "BUILDING_COLLAPSE"
            needs = ["RESCUE", "MEDICAL", "POWER"]
            severity = 8.0
        elif any(w in text_lower for w in ["landslide", "mudslide", "slope"]):
            category = "LANDSLIDE"
            needs = ["RESCUE", "EVACUATION"]
            severity = 7.0
        elif any(w in text_lower for w in ["injured", "hospital", "medical", "bleeding"]):
            category = "MEDICAL_EMERGENCY"
            needs = ["MEDICAL", "AMBULANCE"]
            severity = 6.0
        else:
            category = "OTHER"
            needs = ["RESCUE"]
            severity = 5.0

        # Urgency detection
        if any(w in text_lower for w in ["urgent", "dying", "critical", "emergency", "sos"]):
            urgency = "CRITICAL"
            severity = min(severity + 2.0, 10.0)
        elif any(w in text_lower for w in ["help", "need", "stuck", "danger"]):
            urgency = "HIGH"
            severity = min(severity + 1.0, 10.0)
        else:
            urgency = "MEDIUM"

        return {
            "predicted_category": category,
            "urgency_level": urgency,
            "extracted_needs": needs,
            "damage_severity": severity,
            "confidence_score": 0.75,
            "summary": f"Mock AI: Classified as {category} with {urgency} urgency",
            "recommended_actions": [
                f"Deploy {needs[0]} team to incident location",
                "Establish communication with affected persons",
                "Set up temporary relief point nearby",
            ],
        }
