import { useState } from 'react';

export default function BackendStatus() {
  const [message, setMessage] = useState("Backend not checked yet.");
  const [isChecking, setIsChecking] = useState(false);

  async function checkBackend() {
    setIsChecking(true);
    setMessage("Checking backend status...");

    try {
        const response = await fetch("http://127.0.0.1:8000/health", {
            signal: AbortSignal.timeout(5000) // 5 seconds timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status !== "ok") {
            throw new Error("Backend health check failed.");
        }

        setMessage("Backend connected");
    } catch {
        setMessage("Backend not connected. Check that FastAPI is running");
    } finally {
        setIsChecking(false);
    }
  }

  return (
    <section aria-label="Backend connection">
        <button type="button" onClick={checkBackend} disabled={isChecking}>
            {isChecking ? "Checking..." : "Check Backend Status"}
        </button>
        <p role="status">{message}</p>
    </section>
  );
}