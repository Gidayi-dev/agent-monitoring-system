export function detectDrift(session) {
  const events = session.events;

  if (events.length < 6) {
    return { isDrifting: false };
  }

  const midpoint = Math.floor(events.length / 2);

  const firstHalf = events.slice(0, midpoint);
  const secondHalf = events.slice(midpoint);

  function getDominantFile(events) {
    const counts = {};

    for (const e of events) {
      const file = e.metadata?.file;

      if (!file) continue;

      if (!counts[file]) {
        counts[file] = 0;
      }

      counts[file]++;
    }

    let dominant = null;
    let max = 0;

    for (const file in counts) {
      if (counts[file] > max) {
        max = counts[file];
        dominant = file;
      }
    }

    return dominant;
  }

  const firstDominant = getDominantFile(firstHalf);
  const secondDominant = getDominantFile(secondHalf);

  const isDrifting =
    firstDominant &&
    secondDominant &&
    firstDominant !== secondDominant;

  return {
    isDrifting,
    firstDominant,
    secondDominant
  };
}