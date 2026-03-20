#!/usr/bin/env python3
"""
Sacred Trinity Agent Runner - Response Collection System
Automated response collection from FastAPI:8000, Flask:5000, Gradio:7860

Implements comprehensive Sacred Trinity testing with:
- FastAPI Quantum Conduit interaction
- Flask Glyph Weaver dashboard testing  
- Gradio Truth Mirror ethical processing
- Cross-component integration verification
"""

import os
import json
import asyncio
import aiohttp
import logging
import websockets
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SacredTrinityAgentRunner:
    """🤖 Automated response collection for Sacred Trinity evaluation"""
    
    def __init__(self):
        self.trinity_endpoints = {
            "fastapi": "http://localhost:8000",
            "flask": "http://localhost:5000", 
            "gradio": "http://localhost:7860"
        }
        self.session = None
        self.collected_responses = []
        self.health_status = {}
        
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def run_comprehensive_collection(self, test_queries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Run comprehensive response collection across Sacred Trinity"""
        logger.info("🌌 Initiating Sacred Trinity Response Collection...")
        
        # First check health of all components
        await self.check_trinity_health()
        
        # Collect responses for each test query
        for query_data in test_queries:
            try:
                response_data = await self.collect_component_response(query_data)
                self.collected_responses.append(response_data)
                
                # Add small delay between requests
                await asyncio.sleep(0.5)
                
            except Exception as e:
                logger.error(f"Failed to collect response for {query_data.get('test_id', 'unknown')}: {e}")
                # Add error response to maintain dataset consistency
                error_response = self._create_error_response(query_data, str(e))
                self.collected_responses.append(error_response)
        
        logger.info(f"✅ Collected {len(self.collected_responses)} responses from Sacred Trinity")
        return self.collected_responses
    
    async def check_trinity_health(self) -> Dict[str, bool]:
        """Check health status of all Sacred Trinity components"""
        logger.info("🔍 Checking Sacred Trinity health status...")
        
        health_checks = {
            "fastapi": self._check_fastapi_health(),
            "flask": self._check_flask_health(),
            "gradio": self._check_gradio_health()
        }
        
        # Run health checks concurrently
        for component, health_coro in health_checks.items():
            try:
                is_healthy = await health_coro
                self.health_status[component] = is_healthy
                status_emoji = "✅" if is_healthy else "❌"
                logger.info(f"{status_emoji} {component.upper()}: {'Healthy' if is_healthy else 'Unavailable'}")
            except Exception as e:
                self.health_status[component] = False
                logger.warning(f"❌ {component.upper()}: Health check failed - {e}")
        
        return self.health_status
    
    async def _check_fastapi_health(self) -> bool:
        """Check FastAPI Quantum Conduit health"""
        try:
            async with self.session.get(f"{self.trinity_endpoints['fastapi']}/", timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("status") == "healthy"
                return False
        except Exception as e:
            logger.debug(f"FastAPI health check failed: {e}")
            return False
    
    async def _check_flask_health(self) -> bool:
        """Check Flask Glyph Weaver health"""
        try:
            async with self.session.get(f"{self.trinity_endpoints['flask']}/health", timeout=10) as response:
                if response.status == 200:
                    # Flask health endpoint might return HTML or JSON
                    content_type = response.headers.get('content-type', '')
                    if 'application/json' in content_type:
                        data = await response.json()
                        return data.get("status") == "healthy"
                    else:
                        # Check if HTML contains health indicators
                        html_content = await response.text()
                        return "healthy" in html_content.lower() or "pi forge" in html_content.lower()
                return False
        except Exception as e:
            logger.debug(f"Flask health check failed: {e}")
            return False
    
    async def _check_gradio_health(self) -> bool:
        """Check Gradio Truth Mirror health"""
        try:
            async with self.session.get(f"{self.trinity_endpoints['gradio']}/", timeout=10) as response:
                # Gradio typically returns 200 with HTML interface
                return response.status == 200
        except Exception as e:
            logger.debug(f"Gradio health check failed: {e}")
            return False
    
    async def collect_component_response(self, query_data: Dict[str, Any]) -> Dict[str, Any]:
        """Collect response from appropriate Sacred Trinity component"""
        component = query_data.get("component", "unknown")
        query = query_data.get("query", "")
        
        logger.info(f"📡 Collecting response from {component.upper()} for: {query[:50]}...")
        
        if component == "fastapi":
            response = await self._collect_fastapi_response(query_data)
        elif component == "flask": 
            response = await self._collect_flask_response(query_data)
        elif component == "gradio":
            response = await self._collect_gradio_response(query_data)
        elif component == "integration":
            response = await self._collect_integration_response(query_data)
        else:
            response = {"error": f"Unknown component: {component}", "status": "failed"}
        
        # Enrich response with collection metadata
        enriched_response = {
            **query_data,  # Include original query data
            "response": response.get("response", "No response available"),
            "response_metadata": {
                "collection_timestamp": datetime.utcnow().isoformat(),
                "component_status": self.health_status.get(component, False),
                "response_status": response.get("status", "unknown"),
                "response_time_ms": response.get("response_time_ms", 0),
                "error": response.get("error")
            }
        }
        
        return enriched_response
    
    async def _collect_fastapi_response(self, query_data: Dict[str, Any]) -> Dict[str, Any]:
        """Collect response from FastAPI Quantum Conduit"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Test different FastAPI endpoints based on query focus
            evaluation_focus = query_data.get("evaluation_focus", "general")
            
            if "authentication" in evaluation_focus:
                endpoint = "/"
            elif "websocket" in evaluation_focus or "consciousness" in evaluation_focus:
                return await self._test_websocket_connection()
            elif "database" in evaluation_focus:
                endpoint = "/users/me"  # Protected endpoint requiring auth
            else:
                endpoint = "/"  # Default health endpoint
            
            url = f"{self.trinity_endpoints['fastapi']}{endpoint}"
            
            async with self.session.get(url, timeout=15) as response:
                response_time = (asyncio.get_event_loop().time() - start_time) * 1000
                
                if response.status == 200:
                    try:
                        data = await response.json()
                        return {
                            "response": f"FastAPI response: {json.dumps(data, indent=2)}",
                            "status": "success",
                            "response_time_ms": response_time
                        }
                    except:
                        text_data = await response.text()
                        return {
                            "response": f"FastAPI response: {text_data[:500]}...",
                            "status": "success", 
                            "response_time_ms": response_time
                        }
                else:
                    return {
                        "response": f"FastAPI returned status {response.status}",
                        "status": "error",
                        "response_time_ms": response_time
                    }
                    
        except Exception as e:
            response_time = (asyncio.get_event_loop().time() - start_time) * 1000
            return {
                "response": f"FastAPI connection failed: {str(e)}",
                "status": "failed",
                "response_time_ms": response_time,
                "error": str(e)
            }
    
    async def _test_websocket_connection(self) -> Dict[str, Any]:
        """Test WebSocket consciousness streaming"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            ws_url = "ws://localhost:8000/ws/collective-insight"
            
            async with websockets.connect(ws_url, timeout=10) as websocket:
                # Send test message
                test_message = {"type": "test", "message": "Sacred Trinity evaluation test"}
                await websocket.send(json.dumps(test_message))
                
                # Wait for response
                response = await asyncio.wait_for(websocket.recv(), timeout=5)
                response_time = (asyncio.get_event_loop().time() - start_time) * 1000
                
                return {
                    "response": f"WebSocket connection successful: {response}",
                    "status": "success",
                    "response_time_ms": response_time
                }
                
        except Exception as e:
            response_time = (asyncio.get_event_loop().time() - start_time) * 1000
            return {
                "response": f"WebSocket connection failed: {str(e)}",
                "status": "failed",
                "response_time_ms": response_time,
                "error": str(e)
            }
    
    async def _collect_flask_response(self, query_data: Dict[str, Any]) -> Dict[str, Any]:
        """Collect response from Flask Glyph Weaver"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            evaluation_focus = query_data.get("evaluation_focus", "general")
            
            if "dashboard" in evaluation_focus or "visualization" in evaluation_focus:
                endpoint = "/resonance-dashboard"
            elif "quantum_processing" in evaluation_focus:
                endpoint = "/resonate/test_hash_123"
            else:
                endpoint = "/health"
            
            url = f"{self.trinity_endpoints['flask']}{endpoint}"
            
            async with self.session.get(url, timeout=15) as response:
                response_time = (asyncio.get_event_loop().time() - start_time) * 1000
                
                if response.status == 200:
                    content_type = response.headers.get('content-type', '')
                    
                    if 'application/json' in content_type:
                        data = await response.json()
                        return {
                            "response": f"Flask dashboard data: {json.dumps(data, indent=2)[:500]}...",
                            "status": "success",
                            "response_time_ms": response_time
                        }
                    else:
                        html_content = await response.text()
                        # Extract meaningful content from HTML
                        response_summary = self._extract_flask_content(html_content)
                        return {
                            "response": f"Flask response: {response_summary}",
                            "status": "success",
                            "response_time_ms": response_time
                        }
                else:
                    return {
                        "response": f"Flask returned status {response.status}",
                        "status": "error",
                        "response_time_ms": response_time
                    }
                    
        except Exception as e:
            response_time = (asyncio.get_event_loop().time() - start_time) * 1000
            return {
                "response": f"Flask connection failed: {str(e)}",
                "status": "failed",
                "response_time_ms": response_time,
                "error": str(e)
            }
    
    def _extract_flask_content(self, html_content: str) -> str:
        """Extract meaningful content from Flask HTML response"""
        # Look for key indicators in Flask response
        indicators = [
            "Pi Forge", "Quantum Genesis", "healthy", "dashboard", 
            "resonance", "visualization", "archetype", "collective wisdom"
        ]
        
        found_content = []
        for indicator in indicators:
            if indicator.lower() in html_content.lower():
                found_content.append(indicator)
        
        if found_content:
            return f"Flask Glyph Weaver active - Found: {', '.join(found_content)}"
        else:
            return f"Flask response received ({len(html_content)} chars)"
    
    async def _collect_gradio_response(self, query_data: Dict[str, Any]) -> Dict[str, Any]:
        """Collect response from Gradio Truth Mirror"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Gradio interface check
            url = f"{self.trinity_endpoints['gradio']}/"
            
            async with self.session.get(url, timeout=15) as response:
                response_time = (asyncio.get_event_loop().time() - start_time) * 1000
                
                if response.status == 200:
                    html_content = await response.text()
                    gradio_indicators = self._extract_gradio_content(html_content)
                    
                    return {
                        "response": f"Gradio Truth Mirror active: {gradio_indicators}",
                        "status": "success",
                        "response_time_ms": response_time
                    }
                else:
                    return {
                        "response": f"Gradio returned status {response.status}",
                        "status": "error", 
                        "response_time_ms": response_time
                    }
                    
        except Exception as e:
            response_time = (asyncio.get_event_loop().time() - start_time) * 1000
            return {
                "response": f"Gradio connection failed: {str(e)}",
                "status": "failed",
                "response_time_ms": response_time,
                "error": str(e)
            }
    
    def _extract_gradio_content(self, html_content: str) -> str:
        """Extract meaningful content from Gradio HTML response"""
        gradio_indicators = [
            "gradio", "interface", "ethical", "audit", "veto", "triad",
            "synthesis", "coherence", "canticle", "sovereign"
        ]
        
        found_indicators = []
        for indicator in gradio_indicators:
            if indicator.lower() in html_content.lower():
                found_indicators.append(indicator)
        
        if found_indicators:
            return f"Ethical audit interface ready - Found: {', '.join(found_indicators[:5])}"
        else:
            return f"Gradio interface available ({len(html_content)} chars)"
    
    async def _collect_integration_response(self, query_data: Dict[str, Any]) -> Dict[str, Any]:
        """Collect cross-component integration response"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Test integration by checking all components
            integration_results = {
                "fastapi_status": self.health_status.get("fastapi", False),
                "flask_status": self.health_status.get("flask", False), 
                "gradio_status": self.health_status.get("gradio", False)
            }
            
            all_healthy = all(integration_results.values())
            healthy_count = sum(integration_results.values())
            
            response_time = (asyncio.get_event_loop().time() - start_time) * 1000
            
            integration_summary = f"Sacred Trinity Integration: {healthy_count}/3 components healthy"
            if all_healthy:
                integration_summary += " - Full Trinity synchronization achieved"
            elif healthy_count >= 2:
                integration_summary += " - Partial Trinity coordination maintained"
            else:
                integration_summary += " - Trinity requires restoration"
            
            return {
                "response": integration_summary,
                "status": "success" if healthy_count >= 2 else "degraded",
                "response_time_ms": response_time,
                "integration_details": integration_results
            }
            
        except Exception as e:
            response_time = (asyncio.get_event_loop().time() - start_time) * 1000
            return {
                "response": f"Integration test failed: {str(e)}",
                "status": "failed",
                "response_time_ms": response_time,
                "error": str(e)
            }
    
    def _create_error_response(self, query_data: Dict[str, Any], error: str) -> Dict[str, Any]:
        """Create error response to maintain dataset consistency"""
        return {
            **query_data,
            "response": f"Error during response collection: {error}",
            "response_metadata": {
                "collection_timestamp": datetime.utcnow().isoformat(),
                "component_status": False,
                "response_status": "error",
                "response_time_ms": 0,
                "error": error
            }
        }
    
    async def save_responses_dataset(self, filename: str = "trinity_responses.jsonl") -> str:
        """Save collected responses as JSONL dataset"""
        filepath = Path(filename)
        
        with open(filepath, 'w') as f:
            for response_data in self.collected_responses:
                f.write(json.dumps(response_data) + "\
")
        
        logger.info(f"💾 Saved {len(self.collected_responses)} responses to {filepath}")
        return str(filepath)
    
    def get_collection_summary(self) -> Dict[str, Any]:
        """Get summary of response collection"""
        if not self.collected_responses:
            return {"status": "no_data", "message": "No responses collected"}
        
        # Calculate statistics
        total_responses = len(self.collected_responses)
        successful_responses = sum(1 for r in self.collected_responses 
                                 if r.get("response_metadata", {}).get("response_status") == "success")
        
        # Component breakdown
        component_stats = {}
        for response in self.collected_responses:
            component = response.get("component", "unknown")
            if component not in component_stats:
                component_stats[component] = {"total": 0, "successful": 0}
            component_stats[component]["total"] += 1
            if response.get("response_metadata", {}).get("response_status") == "success":
                component_stats[component]["successful"] += 1
        
        return {
            "status": "complete",
            "total_responses": total_responses,
            "successful_responses": successful_responses,
            "success_rate": successful_responses / total_responses if total_responses > 0 else 0,
            "component_breakdown": component_stats,
            "trinity_health": self.health_status,
            "collection_timestamp": datetime.utcnow().isoformat()
        }

async def main():
    """Main agent runner execution for testing"""
    print("🤖 Sacred Trinity Agent Runner - Response Collection System")
    print("🌌 Testing Sacred Trinity architecture response collection...")
    
    # Example test queries for demonstration
    sample_queries = [
        {
            "query": "Test FastAPI quantum conduit health and authentication",
            "component": "fastapi",
            "evaluation_focus": "authentication_security",
            "test_id": "demo_fastapi_001"
        },
        {
            "query": "Test Flask glyph weaver dashboard visualization",
            "component": "flask",
            "evaluation_focus": "visualization_accuracy", 
            "test_id": "demo_flask_001"
        },
        {
            "query": "Test Gradio truth mirror ethical audit interface",
            "component": "gradio",
            "evaluation_focus": "ethical_processing",
            "test_id": "demo_gradio_001" 
        }
    ]
    
    async with SacredTrinityAgentRunner() as agent_runner:
        # Collect responses
        responses = await agent_runner.run_comprehensive_collection(sample_queries)
        
        # Save dataset
        dataset_file = await agent_runner.save_responses_dataset("demo_responses.jsonl")
        
        # Print summary
        summary = agent_runner.get_collection_summary()
        print("\
📊 Collection Summary:")
        print(json.dumps(summary, indent=2))
        
        print(f"\
💾 Responses saved to: {dataset_file}")
        print("✅ Sacred Trinity response collection complete!")
        
        return responses

if __name__ == "__main__":
    asyncio.run(main())
