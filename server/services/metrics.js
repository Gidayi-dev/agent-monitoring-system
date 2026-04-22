export function computeSessionMetrics(session) {
    const events = session.events;

    const totalSteps = events.length;

    let success = 0;
    let failure = 0;

    const actionDistribution = {};

    for (const e of events) {
        // success vs failure
        if (e.metadata?.status === "success") success++;
        else if (e.metadata?.status === "failure") failure++;

        // action distribution
        if (!actionDistribution[e.action]) {
            actionDistribution[e.action] = 0;
        }
        actionDistribution[e.action]++;
    }

    return {
        totalSteps,
        success,
        failure,
        successRate: totalSteps ? success / totalSteps : 0,
        failureRate: totalSteps ? failure / totalSteps : 0,
        actionDistribution
    };
}