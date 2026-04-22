import e from "express";

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
  res.json(sessions);
});

export default router