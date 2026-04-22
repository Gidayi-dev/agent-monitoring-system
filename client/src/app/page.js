"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [sessions, setSessions] = useState({});

  async function fetchSessions() {
    const res = await fetch("http://localhost:4000/events/sessions");
    const data = await res.json();
    setSessions(data);
  }

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Agent Monitoring Dashboard</h1>

      {Object.entries(sessions).map(([id, session]) => (
        <div key={id} style={{ border: "1px solid #ccc", marginTop: 10, padding: 10 }}>
          <h3>Session: {id}</h3>

          <p>Status: <b>{session.status}</b></p>

          <p>Total Steps: {session.metrics.totalSteps}</p>
          <p>Success Rate: {session.metrics.successRate}</p>
          <p>Failure Rate: {session.metrics.failureRate}</p>

          <h4>Actions</h4>
          <pre>{JSON.stringify(session.metrics.actionDistribution, null, 2)}</pre>
        </div>
      ))}
    </main>
  );
}