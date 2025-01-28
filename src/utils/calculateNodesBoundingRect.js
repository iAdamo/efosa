export const calculateNodesBoundingRect = (nodes) => {
  const boundingRect = {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  for (const ONNode of nodes) {
    if (ONNode.position.x < boundingRect.minX) boundingRect.minX = ONNode.position.x;
    if (ONNode.position.y < boundingRect.minY) boundingRect.minY = ONNode.position.y;

    if (ONNode.position.x > boundingRect.maxX) boundingRect.maxX = ONNode.position.x;
    if (ONNode.position.y > boundingRect.maxY) boundingRect.maxY = ONNode.position.y;
  }

  // Check if the boundingRect values are valid
  if (!Number.isFinite(boundingRect.minX) ||
      !Number.isFinite(boundingRect.minY) ||
      !Number.isFinite(boundingRect.maxX) ||
      !Number.isFinite(boundingRect.maxY)) {
    throw new Error('Invalid boundingRect values');
  }

  // Set invalid boundingRect values to 0
  if (!Number.isFinite(boundingRect.minX)) boundingRect.minX = 0;
  if (!Number.isFinite(boundingRect.minY)) boundingRect.minY = 0;
  if (!Number.isFinite(boundingRect.maxX)) boundingRect.maxX = 0;
  if (!Number.isFinite(boundingRect.maxY)) boundingRect.maxY = 0;

  return boundingRect;
};
