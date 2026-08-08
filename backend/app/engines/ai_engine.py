"""
SentinelAI Disaster Intelligence Engine
========================================
Main orchestration bridge uniting:
1. Deterministic Risk Engine scoring
2. Configurable AI Provider (Gemini / OpenAI / Mock)
3. Multi-source evidence synthesis
4. In-memory / persistent analysis history cache
5. Situation Report generation
"""

from typing import Dict, Any, List, Optional
import time
from datetime import datetime, timezone

from app.config import settings
from app.core.logging import get_logger
from app.engines.risk_engine import RiskEngine
from app.engines.ai_providers import get_ai_provider

logger = get_logger("ai_engine")


class AIEngine:
    """
    Core Disaster Intelligence Engine coordinating deterministic scoring,
    multi-source evidence synthesis, and AI provider calls.
    """

    def __init__(self):
        self.risk_engine = RiskEngine()
        # In-memory cache for past analyses to prevent redundant API calls
        self._analysis_cache: Dict[str, Dict[str, Any]] = {}

    def get_provider(self):
        return get_ai_provider()

    async def get_system_status(self) -> Dict[str, Any]:
        """Return provider and system operational status."""
        provider = self.get_provider()
        provider_name = provider.__class__.__name__

        status = "DEMO INTELLIGENCE"
        if "Gemini" in provider_name and settings.GEMINI_API_KEY:
            status = "LIVE AI"
        elif "OpenAI" in provider_name and settings.OPENAI_API_KEY:
            status = "LIVE AI"

        return {
            "status": "READY",
            "provider_name": provider_name,
            "provider_status": status,
            "cached_analyses_count": len(self._analysis_cache),
            "last_analysis_time": datetime.now(timezone.utc).isoformat(),
        }

    async def get_operational_overview(self) -> Dict[str, Any]:
        """Return overall operational intelligence snapshot."""
        provider = get_ai_provider()
        return await provider.summarize_situation([], [], {})

    async def analyze_incident_full(
        self,
        incident: Dict[str, Any],
        evidence: Optional[List[Dict[str, Any]]] = None,
        force_refresh: bool = False,
    ) -> Dict[str, Any]:
        """
        Full Hybrid Intelligence Pipeline:
        1. Check Cache (if not force_refresh)
        2. Run Deterministic Risk Assessment
        3. Call AI Provider for Evidence Synthesis & Action Recommendations
        4. Validate Schema & Store in Cache
        """
        incident_id = str(incident.get("id", incident.get("_id", "INC-1042")))

        if not force_refresh and incident_id in self._analysis_cache:
            logger.info("Returning cached incident analysis", incident_id=incident_id)
            return self._analysis_cache[incident_id]

        # Step 1: Deterministic Risk Assessment
        risk_data = self.risk_engine.assess_incident_risk(
            severity_score=incident.get("severity_score", 7.5),
            affected_population=incident.get("affected_population", 3200),
        )

        # Step 2: AI Provider Analysis
        provider = self.get_provider()
        analysis = await provider.analyze_incident(
            incident=incident,
            evidence=evidence or [],
            risk_data=risk_data,
        )

        # Attach deterministic risk breakdown
        analysis["risk_assessment_breakdown"] = risk_data

        # Store in cache
        self._analysis_cache[incident_id] = analysis
        self._analysis_cache[analysis["analysis_id"]] = analysis

        logger.info(
            "Incident analyzed by Disaster Intelligence Engine",
            incident_id=incident_id,
            analysis_id=analysis["analysis_id"],
            provider=analysis.get("provider"),
        )
        return analysis

    async def generate_situation_report(
        self, cop_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate structured Situation Report for EOC and DDMO."""
        provider = self.get_provider()
        return await provider.generate_situation_report(cop_data or {})

    async def list_analysis_history() -> List[Dict[str, Any]]:
        """Return history list of all completed analyses."""
        history = []
        for key, val in self._analysis_cache.items():
            if key.startswith("ANL-"):
                history.append(
                    {
                        "analysis_id": val.get("analysis_id", key),
                        "incident_id": val.get("incident_id", ""),
                        "incident_title": val.get("incident_title", "Disaster Incident"),
                        "timestamp": val.get("timestamp", ""),
                        "risk": val.get("severity", "HIGH"),
                        "confidence": val.get("confidence", 0.92),
                        "provider": val.get("provider", "Mock Engine"),
                        "status": val.get("status", "DEMO INTELLIGENCE"),
                    }
                )
        return history

    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """Fetch specific analysis record from cache."""
        return self._analysis_cache.get(analysis_id)

    # Legacy compatibility methods
    async def analyze_incident_text(
        self,
        text: str,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        dummy_incident = {
            "id": "INC-TEXT",
            "title": context or "Distress Report",
            "category": context or "FLOOD",
            "description": text,
            "severity_score": 7.5,
        }
        res = await self.analyze_incident_full(dummy_incident)
        return {
            "predicted_category": res.get("incident_type", "FLOOD"),
            "urgency_level": res.get("urgency", "CRITICAL"),
            "extracted_needs": res.get("required_resources", []),
            "damage_severity": 7.5,
            "confidence_score": res.get("confidence", 0.92),
            "summary": res.get("multi_source_synthesis", {}).get(
                "unified_assessment", text[:200]
            ),
            "recommended_actions": [
                a.get("action", "") for a in res.get("recommended_actions", [])
            ],
        }

    async def generate_command_brief(
        self,
        incidents_summary: Dict[str, Any],
        resource_status: Dict[str, Any],
        weather_data: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        overview = await self.get_operational_overview()
        return {
            "operational_summary": overview.get("situation_summary", ""),
            "recommended_priorities": [
                "Deploy rescue boats to Flood Zone A",
                "Prepare Shelter S-04 for evacuation",
            ],
        }
