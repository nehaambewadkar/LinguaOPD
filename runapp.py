import subprocess
import os
import sys
import time

def main():
    print("Starting Multilingual OPD Documentation System...")
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    # Path to the virtual environment's python executable
    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    
    # Command for frontend (use npm.cmd on Windows)
    frontend_cmd = ["npm.cmd", "run", "dev"] if os.name == 'nt' else ["npm", "run", "dev"]

    try:
        print(f"--> [1/2] Launching Backend Server on port 8000...")
        backend_process = subprocess.Popen(
            [venv_python, "-m", "uvicorn", "main:app", "--reload"],
            cwd=backend_dir
        )
        
        # Give the backend a quick second to start before pumping frontend logs
        time.sleep(2)
        
        print(f"--> [2/2] Launching Frontend React App on port 5173...")
        frontend_process = subprocess.Popen(
            frontend_cmd,
            cwd=frontend_dir
        )

        print("\n=== SYSTEM IS RUNNING ===")
        print("- Backend API: http://localhost:8000")
        print("- Frontend UI: http://localhost:5173\n")
        print("Press Ctrl+C to stop both servers...\n")

        # Keep the script running to hold the processes open
        backend_process.wait()
        frontend_process.wait()
        
    except KeyboardInterrupt:
        print("\nShutting down servers safely...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Shutdown complete.")

if __name__ == "__main__":
    main()
