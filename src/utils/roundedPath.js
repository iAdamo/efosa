export function generateRoundedPath(points, radius) {
    const path = [];
    const n = points.length;

    if (n < 2) {
        return "";
    }

    for (let i = 0; i < n - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        // Calculate vector and segment length
        const dx = next[0] - current[0];
        const dy = next[1] - current[1];
        const segmentLength = Math.sqrt(dx ** 2 + dy ** 2);

        // Clamp radius to half the segment length
        const clampedRadius = Math.min(radius, segmentLength / 2);

        // Calculate normalized direction vector
        const normX = dx / segmentLength;
        const normY = dy / segmentLength;

        // Offset points
        const startOffset = [
            current[0] + normX * clampedRadius,
            current[1] + normY * clampedRadius,
        ];
        const endOffset = [
            next[0] - normX * clampedRadius,
            next[1] - normY * clampedRadius,
        ];

        // Add move or line command to the path
        if (i === 0) {
            path.push(`M ${startOffset[0]} ${startOffset[1]}`);
        } else {
            path.push(`L ${startOffset[0]} ${startOffset[1]}`);
        }

        // Determine the sweep-flag based on the direction of the curve
        const sweepFlag = (dx * dy > 0) ? 1 : 0;

        // Add arc to connect the offsets
        path.push(
            `A ${clampedRadius} ${clampedRadius} 0 0 ${sweepFlag} ${endOffset[0]} ${endOffset[1]}`,
        );
    }

    // Add the last segment as a straight line
    const lastPoint = points[n - 1];
    path.push(`L ${lastPoint[0]} ${lastPoint[1]}`);

    return path.join(" ");
}
