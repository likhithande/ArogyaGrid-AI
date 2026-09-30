#!/usr/bin/env python3
"""
ArogyaGrid AI — Unified Single URL Launcher
Runs both the React Frontend and FastAPI Backend seamlessly under a single URL.
Usage:
    python run.py             # Start unified application on http://localhost:8000
    python run.py --build     # Rebuild frontend first, then start
    python run.py --dev       # Auto-rebuild frontend on changes (watch mode) + backend
    python run.py --port 8080 # Run on custom port
"""

import os
import sys
import argparse
import subprocess
import threading
import time
import webbrowser

# Force UTF-8 stdout if possible on Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
DIST_DIR = os.path.join(FRONTEND_DIR, "dist")

def print_banner(host: str, port: int, dev_mode: bool):
    url_host = "localhost" if host in ("0.0.0.0", "127.0.0.1") else host
    base_url = f"http://{url_host}:{port}"
    print("\n" + "=" * 76)
    print("  [AROGYAGRID AI] - UNIFIED SINGLE URL SERVICE")
    print("  Federated Intelligence for Resilient Public Healthcare")
    print("=" * 76)
    print(f"  * Single URL Web App:       {base_url}")
    print(f"  * Swagger API Docs:         {base_url}/docs")
    print(f"  * Live WebSocket Stream:    ws://{url_host}:{port}/ws/telemetry")
    print(f"  * Architecture:             FastAPI Backend + React Frontend Unified")
    if dev_mode:
        print(f"  * Watch Mode:               ACTIVE (Frontend auto-recompiles on edit)")
    print("=" * 76)
    print(f"  Press CTRL+C to stop the unified server\n")

def check_and_build_frontend(force_build: bool = False):
    needs_build = force_build or not os.path.exists(DIST_DIR) or not os.path.exists(os.path.join(DIST_DIR, "index.html"))
    if needs_build:
        print("[*] Building frontend static bundle into frontend/dist...")
        node_modules = os.path.join(FRONTEND_DIR, "node_modules")
        if not os.path.exists(node_modules):
            print("[*] Installing frontend dependencies (npm install)...")
            subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, shell=True, check=True)
        subprocess.run(["npm", "run", "build"], cwd=FRONTEND_DIR, shell=True, check=True)
        print("[+] Frontend build completed successfully.")

def open_browser_delayed(url: str, delay: float = 1.5):
    def _open():
        time.sleep(delay)
        try:
            webbrowser.open(url)
        except Exception:
            pass
    threading.Thread(target=_open, daemon=True).start()

def main():
    parser = argparse.ArgumentParser(description="Run ArogyaGrid AI on a single unified URL")
    parser.add_argument("--host", default="127.0.0.1", help="Host address (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Port to serve both frontend and backend (default: 8000)")
    parser.add_argument("--build", action="store_true", help="Force rebuild frontend before launching")
    parser.add_argument("--dev", action="store_true", help="Run frontend in watch mode (auto-recompiles on changes)")
    parser.add_argument("--no-browser", action="store_true", help="Do not automatically open the browser")
    args = parser.parse_args()

    # Ensure frontend bundle exists
    check_and_build_frontend(force_build=args.build)

    watch_proc = None
    if args.dev:
        print("[*] Starting Vite watch compiler in background...")
        watch_cmd = "npx vite build --watch"
        watch_proc = subprocess.Popen(watch_cmd, cwd=FRONTEND_DIR, shell=True)

    # Ensure backend directory is in sys.path
    if BACKEND_DIR not in sys.path:
        sys.path.insert(0, BACKEND_DIR)

    url_host = "localhost" if args.host in ("0.0.0.0", "127.0.0.1") else args.host
    app_url = f"http://{url_host}:{args.port}"
    print_banner(args.host, args.port, args.dev)

    # Check if port is already in use
    import socket
    def is_port_in_use(port_num: int, host_ip: str) -> bool:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.5)
            return s.connect_ex((host_ip, port_num)) == 0

    if is_port_in_use(args.port, args.host):
        print(f"\n[!] WARNING: Port {args.port} is already in use by another process.")
        print(f"[*] ArogyaGrid AI is already running or a previous process did not close.")
        print(f"[*] Options:")
        print(f"    1. Open existing instance: {app_url}")
        print(f"    2. Run on another port:    python run.py --port 8080")
        print(f"    3. In PowerShell, stop existing instance: Get-Process -Name python | Stop-Process -Force\n")
        if not args.no_browser:
            open_browser_delayed(app_url)
        return

    try:
        import uvicorn
        # Import backend app
        from main import app
        uvicorn.run(app, host=args.host, port=args.port, log_level="info")
    except KeyboardInterrupt:
        print("\n[*] Shutting down unified server...")
    finally:
        if watch_proc:
            try:
                watch_proc.terminate()
            except Exception:
                pass

if __name__ == "__main__":
    main()
