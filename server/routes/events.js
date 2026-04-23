import e from "express";
import { computeSessionMetrics } from "../services/metrics.js";
import { detectDrift } from "../services/detection/drift.js";
import { detectLoop } from "../services/detection/loop.js";
import { detectFailure } from "../services/detection/failure.js"

const router = e.Router();

// In-memory store
const sessions = {};

// Normalize incoming event
function normalizeEvent(raw) {
  return {
    session_id: raw.session_id || "unknown",
    timestamp: raw.timestamp || Date.now(),
    step: raw.step ?? null,
    action: raw.action || "unknown",
    input: raw.input || "",
    output: raw.output || "",
    metadata: {
      file: raw.metadata?.file || null,
      status: raw.metadata?.status || "unknown"
    }
  };
}

router.post("/", (req, res) => {
  // normalize input
  const event = normalizeEvent(req.body);

  // create session if it doesn't exist
  if (!sessions[event.session_id]) {
    sessions[event.session_id] = {
      events: []
    };
  }

  const session = sessions[event.session_id];

  // Deduplication check
  const exists = session.events.some(e =>
    e.timestamp === event.timestamp &&
    e.step === event.step &&
    e.action === event.action
  );

  if (!exists) {
    session.events.push(event);
  }

  // Sort events
  session.events.sort((a, b) => a.timestamp - b.timestamp);

  console.log("Stored event:", event);

  res.json({ message: "Event processed" });
});

// Debug endpoint to view sessions
router.get("/sessions", (req, res) => {
  console.log("Incoming request body:", req.body);
    const result = {};

    for (const sessionId in sessions) {
        const session = sessions[sessionId]
        
        const metrics = computeSessionMetrics(session)
        const failure = detectFailure(session)
        const loop = detectLoop(session)
        const drift = detectDrift(session)

        let status = "healthy"

        if (failure.isFailing) status = "failing"
        else if (loop.isLooping) status = "looping"
        else if (drift.isDrifting) status = "drifting"

        result[sessionId] = {
            events: session.events,
            metrics,
            detection: {
              failure,
              loop,
              drift
            },
            status
        }
    }
    res.json(result)
//   res.json(sessions);
});

export default router