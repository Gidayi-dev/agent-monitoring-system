import axios from "axios";

const BASE_URL = "http://localhost:4000/events";

// helper to send event
async function sendEvent(event) {
  try {
    await axios.post(BASE_URL, event);
    console.log("Sent:", event.action, event.metadata?.file || "");
  } catch (err) {
    console.error("Error sending event");
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function normalScenario() {
  const session_id = "normal-" + Date.now();

  const actions = ["read_file", "llm_call", "write_file"];

  for (let i = 0; i < 6; i++) {
    const event = {
      session_id,
      timestamp: Date.now(),
      action: actions[i % 3],
      metadata: {
        file: "auth.js",
        status: "success"
      }
    };

    await sendEvent(event);
    await sleep(200);
  }
}

async function loopScenario() {
  const session_id = "loop-" + Date.now();

  for (let i = 0; i < 9; i++) {
    const sequence = ["read_file", "llm_call", "write_file"];

    const action = sequence[i % 3];

    const event = {
      session_id,
      timestamp: Date.now(),
      action,
      input: "fix bug " + i, // variation
      metadata: {
        file: "auth.js",
        status: "success"
      }
    };

    await sendEvent(event);
    await sleep(150);
  }
}

async function driftScenario() {
  const session_id = "drift-" + Date.now();

  // first half
  for (let i = 0; i < 3; i++) {
    await sendEvent({
      session_id,
      timestamp: Date.now(),
      action: "read_file",
      metadata: { file: "auth.js", status: "success" }
    });
    await sleep(150);
  }

  // second half (change intent)
  for (let i = 0; i < 3; i++) {
    await sendEvent({
      session_id,
      timestamp: Date.now(),
      action: "read_file",
      metadata: { file: "payment.js", status: "success" }
    });
    await sleep(150);
  }
}

async function failureScenario() {
  const session_id = "fail-" + Date.now();

  for (let i = 0; i < 5; i++) {
    await sendEvent({
      session_id,
      timestamp: Date.now(),
      action: "llm_call",
      metadata: { status: "failure" }
    });
    await sleep(150);
  }
}

const scenario = process.argv[2];

(async () => {
    console.log("Running scenario:", scenario);
    
  if (scenario === "normal") await normalScenario();
  else if (scenario === "loop") await loopScenario();
  else if (scenario === "drift") await driftScenario();
  else if (scenario === "failure") await failureScenario();
  else console.log("Unknown scenario");
})();