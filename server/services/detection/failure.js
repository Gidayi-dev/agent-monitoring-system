export function detectFailure(session) {
    const events = session.events

    let consecutiveFailures = 0
    let maxConsecutiveFailures = 0

    let failureCount = 0

    for (const e of events) {
        if (e.metadata?.status === "failure") {
            consecutiveFailures++;
            failureCount++

            if (consecutiveFailures > maxConsecutiveFailures) {
                maxConsecutiveFailures = consecutiveFailures;
            }
        } else {
            consecutiveFailures = 0
        }
    }

    const failureRate = events.length ? failureCount / events.length : 0

    // Heuristic rules
    const isFailing = maxConsecutiveFailures >= 3 || failureRate > 0.6;

    return {
        isFailing,
        maxConsecutiveFailures,
        failureRate
    }

}