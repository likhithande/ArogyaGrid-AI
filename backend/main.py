import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import uvicorn
import asyncio
import random
import json
from contextlib import asynccontextmanager

from api.router import api_router
from core.config import settings
from data.synthetic_generator import data_store
from services.live_engine import live_broadcaster

active_websockets: list[WebSocket] = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Background task for live telemetry & inventory/incident broadcasting
    live_task = asyncio.create_task(live_broadcaster.start_loop())

    async def telemetry_broadcaster():
        while True:
            await asyncio.sleep(4.0)
            if active_websockets:
                delta_footfall = random.randint(-4, 9)
                delta_stock = random.choice([0, -1, -2, 0])
                msg = json.dumps({
                    "type": "TELEMETRY_HEARTBEAT",
                    "timestamp": asyncio.get_event_loop().time(),
                    "pulse": {
                        "footfall_shift": delta_footfall,
                        "medicine_decrement": delta_stock,
                        "system_status": "OPERATIONAL",
                        "active_nodes": 1248
                    }
                })
                disconnected = []
                for ws in active_websockets:
                    try:
                        await ws.send_text(msg)
                    except Exception:
                        disconnected.append(ws)
                for ws in disconnected:
                    if ws in active_websockets:
                        active_websockets.remove(ws)

    telemetry_task = asyncio.create_task(telemetry_broadcaster())
    yield
    telemetry_task.cancel()
    live_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Federated Intelligence for Resilient Public Healthcare (ArogyaGrid AI)",
    version="2.4.0",
    lifespan=lifespan
)

# Enable CORS for all local frontend ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_PREFIX)

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in active_websockets:
            active_websockets.remove(websocket)
    except Exception:
        if websocket in active_websockets:
            active_websockets.remove(websocket)

@app.websocket("/ws/live")
async def websocket_root_live(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)

@app.websocket("/ws/inventory")
async def websocket_root_inventory(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)

@app.websocket("/ws/incidents")
async def websocket_root_incidents(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)

@app.websocket("/ws/agents")
async def websocket_root_agents(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)

# Serve Frontend static build as unified single URL
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(dist_path):
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(dist_path, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Do not catch API or WebSocket routes
        if full_path.startswith("api/") or full_path == "api" or full_path.startswith("ws/"):
            return JSONResponse(status_code=404, content={"detail": f"Endpoint '/{full_path}' not found"})
        file_path = os.path.join(dist_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "platform": "AROGYAGRID AI",
            "tagline": "Federated Intelligence for Resilient Public Healthcare",
            "status": "ONLINE",
            "docs_url": "/docs",
            "dashboard_api": "/api/dashboard",
            "note": "Frontend dist not found. Run 'npm run build' in frontend directory to serve UI at this URL."
        }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)

