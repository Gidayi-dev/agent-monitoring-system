export function detectLoop(session) {
  const events = session.events;

  if (events.length < 6) {
    return { isLooping: false };
  }

  const actions = events.map(e => e.action);

  const windowSize = 3;
  let repeatCount = 0;

  for (let i = 0; i <= actions.length - windowSize * 2; i++) {
    const first = actions.slice(i, i + windowSize).join(",");
    const second = actions
      .slice(i + windowSize, i + windowSize * 2)
      .join(",");

    if (first === second) {
      repeatCount++;
    }
  }

  const isLooping = repeatCount >= 2;

  return {
    isLooping,
    repeatCount
  };
}