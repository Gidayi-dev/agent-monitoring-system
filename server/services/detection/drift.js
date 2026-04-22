export function detectDrift(session) {
    const events = session.events

    if (events.length < 6) {
        return { isDrifting: false }
    }

    const midpoint = Math.floor(events.length / 2)

    const firstHalf = events.slice(0, midpoint)
    const secondHalf = events.slice(midpoint)

    function getFileDistribution(events) {
        const dist = {}

        for (const e of events) {
            const file = e.matadata?.file || "unknown"

            if (!dist[file]) {
                dist[file] = 0
            }
            dist[file]++;
        }
        return dist
    }
    const firstDist = getFileDistribution(firstHalf)
    const secondDist = getFileDistribution(secondHalf)

    // Get dominant file
    function getDominant(dist) {
        let max = 0
        let dominant = null
        
        for (const key in dist) {
            if (dist[key] > max) {
                max = dist[key]
                dominant = key
            }
        }
        return dominant
    }
    const firstDominant = getDominant(firstDist)
    const secondDominant = getDominant(secondDist)

    const isDrifting = firstDominant !== secondDominant

    return {
        isDrifting,
        firstDominant,
        secondDominant
    }
}