## Overview

This project implements a monitoring system for AI agents operating in development environments.

The system ingests real-time agent activity, processes noisy event streams, and detects behavioral anomalies such as looping, drift, and repeated failures.

It is designed to simulate real-world unreliability in agent workflows and provide actionable insights for debugging and observability.

## Architecture

The system consists of four main components:

- **Event Ingestion API (Express)**  
  Receives agent events via a POST endpoint and normalizes inconsistent input.

- **In-Memory Session Store**  
  Stores events grouped by session_id, handling duplicates and out-of-order events.

- **Processing & Detection Layer**  
  Computes metrics and applies heuristic-based detection for loops, drift, and failures.

- **CLI Agent Simulator**  
  Simulates realistic agent behavior (normal, loop, drift, failure) with noisy patterns.

- **Frontend Dashboard (Next.js)**  
  Displays session-level insights, status, and metrics in near real-time.

  ## Event Processing Flow

Agent Simulator → API → Normalization → Session Store → Metrics → Detection → Frontend

Events are ingested via the API, normalized to handle missing fields, and stored per session.

Each session is processed to compute metrics and detect behavioral anomalies before being exposed to the frontend.

### Loop Detection

Loop detection is implemented using a sliding window approach over action sequences.

Instead of checking for exact duplicate events, the system compares sequences of actions (e.g., read → llm → write) across adjacent windows.

If repeated patterns are detected multiple times, the session is flagged as looping.

This approach avoids naive string matching and captures behavioral repetition even with slight variations in inputs.

### Drift Detection

Drift is detected by comparing early and late session behavior.

The session is split into two halves, and the dominant file being operated on in each half is identified.

If the dominant targets differ (e.g., auth.js → payment.js), the system flags the session as drifting.

This reflects a change in agent intent over time rather than immediate anomalies.

### Failure Detection

Failure detection combines two signals:

- Consecutive failures (local signal)
- Overall failure rate (global signal)

A session is flagged as failing if:
- There are multiple consecutive failures, or
- The failure rate exceeds a threshold

This avoids relying on fixed thresholds alone and captures both burst failures and persistent instability.

## Edge Cases Handled

- Duplicate events (deduplicated using timestamp + action)
- Out-of-order events (sorted by timestamp)
- Missing metadata (normalized with defaults)
- High-frequency bursts (handled via in-memory batching)
- Multiple concurrent sessions (isolated by session_id)

## Design Decisions

### In-Memory Storage
Chosen for simplicity and speed within the time constraint.  
Trade-off: data is not persistent across restarts.

### Heuristic-Based Detection
Used instead of machine learning models due to limited time.  
Trade-off: may not capture all edge cases but remains interpretable and efficient.

### Real-Time Processing
Events are processed immediately upon ingestion.  
Trade-off: increased coupling between ingestion and detection logic.

### Sliding Window for Loop Detection
Chosen to detect patterns rather than exact duplicates, improving robustness.

## Setup

### Backend
cd server  
npm install  
node index.js  

### Simulator
node simulator/agent.js loop  
node simulator/agent.js drift  
node simulator/agent.js failure  

### Frontend
cd client  
npm install  
npm run dev  