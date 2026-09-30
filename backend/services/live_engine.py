import asyncio
import json
import random
import time
from datetime import datetime
from typing import List, Set, Dict, Any
from fastapi import WebSocket

from services.inventory_engine import inventory_engine
from services.incident_engine import incident_engine

class LiveBroadcaster:
    def __init__(self):
        self.active_sockets: Set[WebSocket] = set()
        self.is_broadcasting: bool = False
        self._task: asyncio.Task = None
        self.incident_timer = time.time()
        self.agent_statuses = {
            "demand": "EXECUTING",
            "inventory": "MONITORING",
            "generative_ai": "ANALYZING",
            "emergency": "READY",
            "supply": "MONITORING",
            "workforce": "READY",
            "anomaly": "MONITORING",
            "optimization": "READY",
            "reasoning": "MONITORING",
            "data_intelligence": "READY",
            "incident_response": "STANDBY",
            "report": "READY"
        }

    async def register(self, websocket: WebSocket):
        await websocket.accept()
        self.active_sockets.add(websocket)
        # Send initial welcome state
        try:
            welcome_msg = json.dumps({
                "type": "CONNECTION_ESTABLISHED",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
                "status": "LIVE",
                "mode": "DEMO MODE · SYNTHETIC TELEMETRY",
                "agent_statuses": self.agent_statuses,
                "inventory_summary": inventory_engine.get_inventory_summary(),
                "incident_summary": incident_engine.get_summary()
            })
            await websocket.send_text(welcome_msg)
        except Exception:
            pass

    def unregister(self, websocket: WebSocket):
        if websocket in self.active_sockets:
            self.active_sockets.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        if not self.active_sockets:
            return
        payload = json.dumps(message)
        disconnected = set()
        for ws in self.active_sockets:
            try:
                await ws.send_text(payload)
            except Exception:
                disconnected.add(ws)
        for ws in disconnected:
            self.unregister(ws)

    async def start_loop(self):
        """
        Background broadcast loop running every 2.5 - 3.5 seconds.
        Dispatches continuous dynamic healthcare telemetry.
        """
        while True:
            await asyncio.sleep(random.uniform(2.5, 3.8))
            now_ist = datetime.now().strftime("%H:%M:%S IST")

            # 1. Simulate logical inventory event & broadcast
            inv_event = inventory_engine.simulate_event()
            await self.broadcast({
                "type": "INVENTORY_UPDATE",
                "timestamp": now_ist,
                "event": inv_event,
                "summary": inventory_engine.get_inventory_summary()
            })

            # 2. Telemetry Heartbeat
            await self.broadcast({
                "type": "TELEMETRY_HEARTBEAT",
                "timestamp": now_ist,
                "pulse": {
                    "footfall_shift": random.randint(-3, 8),
                    "active_nodes": 1248,
                    "system_status": "OPERATIONAL",
                    "national_resilience": 87.4 + round(random.uniform(-0.3, 0.4), 1)
                }
            })

            # 3. Dynamic Agent Status Shifts (Visual Live Platform feeling)
            if random.random() < 0.35:
                agent_keys = list(self.agent_statuses.keys())
                picked = random.choice(agent_keys)
                new_st = random.choice(["MONITORING", "ANALYZING", "EXECUTING", "READY"])
                self.agent_statuses[picked] = new_st
                await self.broadcast({
                    "type": "AGENT_STATUS",
                    "timestamp": now_ist,
                    "agent_id": picked,
                    "status": new_st,
                    "all_statuses": self.agent_statuses
                })

            # 4. Periodic Synthetic Incident Generation (Every 30-50s)
            if time.time() - self.incident_timer > random.randint(30, 50):
                self.incident_timer = time.time()
                new_inc = incident_engine.generate_synthetic_incident()
                if new_inc:
                    # Update status of response agents
                    self.agent_statuses["emergency"] = "EXECUTING"
                    self.agent_statuses["generative_ai"] = "ANALYZING"
                    self.agent_statuses["incident_response"] = "EXECUTING"

                    await self.broadcast({
                        "type": "INCIDENT_CREATED",
                        "timestamp": now_ist,
                        "incident": new_inc,
                        "summary": incident_engine.get_summary()
                    })

live_broadcaster = LiveBroadcaster()
