#!/usr/bin/env python3
"""
🌌 QUANTUM TRINITY INTEGRATION BRIDGE
Connects Railway-deployed Lattice with Kubernetes Guardians
Sacred Integration: FastAPI ←→ Guardians ←→ Oracle
"""

import asyncio
import json
import logging
import os
import time
from datetime import datetime
from typing import Dict, List, Optional

import redis
import aiohttp
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trinity_bridge")

class QuantumTrinityBridge:
    def __init__(self):
        self.redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
        self.railway_websocket_url = os.getenv("RAILWAY_WS_URL", "ws://localhost:8000/ws/collective-insight")
        self.guardian_services = os.getenv("GUARDIAN_SERVICES", "http://localhost:8080").split(",")
        self.connected_clients = set()
        
    async def bridge_railway_to_guardians(self, websocket_url: str):
        """Bridge WebSocket data from Railway FastAPI to Guardian validation"""
        logger.info(f"🌐 Connecting to Railway WebSocket: {websocket_url}")
        
        try:
            async with websockets.connect(websocket_url) as websocket:
                logger.info("✅ Connected to Railway Quantum Lattice")
                
                async for message in websocket:
                    try:
                        # Parse quantum resonance data
                        data = json.loads(message)
                        
                        # Transform to Guardian-compatible pulse format
                        pulse_data = {
                            "timestamp": data.get("timestamp", time.time()),
                            "user_id": data.get("user_id"),
                            "payment_data": data.get("payment", {}),
                            "ethical_score": data.get("ethical_score", 0.5),
                            "qualia_impact": data.get("qualia_impact", 0.5),
                            "resonance_value": data.get("resonance_value", 0.0),
                            "phase": data.get("phase", "foundation"),
                            "source": "railway_lattice"
                        }
                        
                        # Send to Guardian validation stream
                        await self._emit_to_guardians(pulse_data)
                        
                        logger.debug(f"🔄 Pulse bridged to Guardians: {pulse_data.get('phase')}")
                        
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON decode error: {e}")
                    except Exception as e:
                        logger.error(f"Bridge processing error: {e}")
                        
        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
            # Retry connection after delay
            await asyncio.sleep(10)
            
    async def _emit_to_guardians(self, pulse_data: Dict):
        """Emit quantum pulse to Guardian validation stream"""
        try:
            # Add to Redis stream for Guardian processing
            self.redis_client.xadd(
                "quantum_pulses",
                {"data": json.dumps(pulse_data)}
            )
            logger.debug("📡 Pulse emitted to Guardian stream")
            
        except Exception as e:
            logger.error(f"Guardian emission error: {e}")
    
    async def monitor_guardian_responses(self):
        """Monitor Guardian validation results and forward to visualization"""
        logger.info("🛡️ Starting Guardian response monitoring")
        
        while True:
            try:
                # Read validated pulses from Guardians
                messages = self.redis_client.xread(
                    {"validated_pulses": "$"}, block=1000, count=10
                )
                
                for stream_name, stream_messages in messages:
                    for message_id, fields in stream_messages:
                        validated_data = json.loads(fields.get(b"data", b"{}"))
                        
                        # Forward to Oracle visualization system
                        await self._forward_to_oracle(validated_data)
                        
                        # Broadcast to connected clients
                        await self._broadcast_to_clients(validated_data)
                        
            except Exception as e:
                logger.error(f"Guardian monitoring error: {e}")
                await asyncio.sleep(5)
    
    async def _forward_to_oracle(self, validated_data: Dict):
        """Forward validated data to Oracle visualization system"""
        try:
            # Store in Oracle visualization stream
            self.redis_client.xadd(
                "oracle_visualizations",
                {"data": json.dumps(validated_data)}
            )
            
            logger.debug(f"🔮 Data forwarded to Oracle: {validated_data.get('guardian_id')}")
            
        except Exception as e:
            logger.error(f"Oracle forwarding error: {e}")
    
    async def _broadcast_to_clients(self, data: Dict):
        """Broadcast Guardian-validated data to connected WebSocket clients"""
        if self.connected_clients:
            message = json.dumps({
                "type": "guardian_validated",
                "data": data,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            disconnected = set()
            for client in self.connected_clients:
                try:
                    await client.send(message)
                except:
                    disconnected.add(client)
            
            # Remove disconnected clients
            self.connected_clients -= disconnected

# FastAPI Bridge Application
bridge = QuantumTrinityBridge()
app = FastAPI(title="Quantum Trinity Integration Bridge", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/trinity-bridge")
async def trinity_websocket(websocket: WebSocket):
    """WebSocket endpoint for Trinity-validated data"""
    await websocket.accept()
    bridge.connected_clients.add(websocket)
    
    try:
        logger.info(f"🌐 Trinity Bridge client connected: {websocket.client}")
        
        while True:
            # Keep connection alive and handle incoming messages
            try:
                data = await websocket.receive_text()
                # Echo back for debugging
                await websocket.send(json.dumps({
                    "type": "bridge_echo",
                    "message": "Trinity Bridge active",
                    "timestamp": datetime.utcnow().isoformat()
                }))
            except WebSocketDisconnect:
                break
                
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        bridge.connected_clients.discard(websocket)
        logger.info("🌐 Trinity Bridge client disconnected")

@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Quantum Trinity Integration Bridge",
        "connected_clients": len(bridge.connected_clients),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/trinity/status")
async def trinity_status():
    """Trinity integration status"""
    try:
        # Check Redis connection
        redis_info = bridge.redis_client.ping()
        
        # Check Guardian stream stats
        guardian_stream_info = bridge.redis_client.xinfo_stream("quantum_pulses") if bridge.redis_client.exists("quantum_pulses") else None
        validated_stream_info = bridge.redis_client.xinfo_stream("validated_pulses") if bridge.redis_client.exists("validated_pulses") else None
        
        return {
            "status": "active",
            "bridge_service": "Quantum Trinity Integration",
            "redis_connected": redis_info,
            "connected_clients": len(bridge.connected_clients),
            "guardian_stream_length": guardian_stream_info.get("length", 0) if guardian_stream_info else 0,
            "validated_stream_length": validated_stream_info.get("length", 0) if validated_stream_info else 0,
            "guardian_services": bridge.guardian_services,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

async def start_bridge_services():
    """Start all bridge services"""
    logger.info("🌌 Starting Quantum Trinity Integration Bridge")
    
    # Start Guardian response monitoring
    asyncio.create_task(bridge.monitor_guardian_responses())
    
    # Start Railway WebSocket bridge (if URL provided)
    if bridge.railway_websocket_url and bridge.railway_websocket_url != "ws://localhost:8000/ws/collective-insight":
        asyncio.create_task(bridge.bridge_railway_to_guardians(bridge.railway_websocket_url))
    
    logger.info("✅ Trinity Bridge services activated")

@app.on_event("startup")
async def startup_event():
    await start_bridge_services()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)