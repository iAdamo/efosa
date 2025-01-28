// Function to compute the coordinates on the cubic Bézier curve for a given t
function bezier(t, P0, P1, P2, P3) {
  const x = (1 - t) ** 3 * P0.x + 3 * (1 - t) ** 2 * t * P1.x + 3 * (1 - t) * t ** 2 * P2.x + t ** 3 * P3.x;
  const y = (1 - t) ** 3 * P0.y + 3 * (1 - t) ** 2 * t * P1.y + 3 * (1 - t) * t ** 2 * P2.y + t ** 3 * P3.y;
  return { x, y };
}

// Function to compute the squared distance between two points
function squaredDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return dx * dx + dy * dy;
}

// Binary search refinement
function binarySearchClosest(P0, P1, P2, P3, targetPoint, low, high, tol = 1e-6) {
  while (high - low > tol) {
    const t1 = low + (high - low) / 3;
    const t2 = high - (high - low) / 3;

    const p1 = bezier(t1, P0, P1, P2, P3);
    const p2 = bezier(t2, P0, P1, P2, P3);

    const d1 = squaredDistance(p1, targetPoint);
    const d2 = squaredDistance(p2, targetPoint);

    if (d1 < d2) {
      high = t2;
    } else {
      low = t1;
    }
  }
  return (low + high) / 2;
}

// Function to find the closest point on the Bézier curve to a target point using binary search
export function findClosestPointOnBezier(P0, P1, P2, P3, targetPoint) {
  // Start with coarse sampling to get an initial guess
  let bestT = 0;
  let minDistance = Number.POSITIVE_INFINITY;
  const numSamples = 10; // Coarse sampling

  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const pointOnCurve = bezier(t, P0, P1, P2, P3);
    const dist = squaredDistance(pointOnCurve, targetPoint);

    if (dist < minDistance) {
      minDistance = dist;
      bestT = t;
    }
  }

  // Refine the best t using binary search
  const refinedT = binarySearchClosest(P0, P1, P2, P3, targetPoint, bestT - 0.1, bestT + 0.1);
  return bezier(refinedT, P0, P1, P2, P3);
}
