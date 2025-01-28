import { NODE_TYPES } from "@/constants";

// Checks if column values match the given condition
const checkColumnConditions = (columns, condition) => {
  console.log(columns, condition);
  for (const [column, value] of Object.entries(condition)) {
    const isNotNullCondition = value === 1; // Condition: not null
    const isColumnValueNotNull = columns[column] != null;
    console.log("column", column, columns[column], isColumnValueNotNull, isNotNullCondition);
    // If condition isn't met, return false
    if (isNotNullCondition !== isColumnValueNotNull) {
      return false;
    }
  }
  return true;
};
// Convert database link format to node link format
export const convertDbtoNodeLinks = (link) => {
  const nodeLinks = { id: String(link.id) };

  // API to API
  if (
    checkColumnConditions(link, {
      fieldsourceID: 1,
      fielddestinationID: 1,
      ONsourceID: 0,
      ONdestinationID: 0,
      nodedestinationID: 0,
      outputIndex: 0,
      onFieldEntryID: 0,
      onFieldExitID: 0,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: "API1",
      sourceHandle: String(link.fieldsourceID),
      target: "API2",
      targetHandle: String(link.fielddestinationID),
    };
  }

  // Field to ON
  if (
    checkColumnConditions(link, {
      fieldsourceID: 1,
      fielddestinationID: 0,
      ONsourceID: 0,
      ONdestinationID: 1,
      nodedestinationID: 0,
      order: 1,
      onFieldEntryID: 0,
      onFieldExitID: 0,
      outputIndex: 0,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: "API1",
      sourceHandle: String(link.fieldsourceID),
      target: String(link.ONdestinationID),
      targetHandle: link.isVariablePassthrough ? `output-passthrough-${link.ONdestinationID}` : `ON-input-${link.ONdestinationID}-${link.order}`,
    };
  }

  // ON to API
  if (
    checkColumnConditions(link, {
      fieldsourceID: 0,
      fielddestinationID: 1,
      ONsourceID: 1,
      ONdestinationID: 0,
      nodedestinationID: 0,
      order: 0,
      onFieldEntryID: 0,
      onFieldExitID: 0,
      outputIndex: 1,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: String(link.ONsourceID),
      sourceHandle: `ON-output-${link.ONsourceID}-${link.outputIndex}`,
      target: "API2",
      targetHandle: String(link.fielddestinationID),
    };
  }

  // ON to ON
  if (
    checkColumnConditions(link, {
      fieldsourceID: 0,
      fielddestinationID: 0,
      ONsourceID: 1,
      ONdestinationID: 1,
      nodedestinationID: 0,
      order: 1,
      onFieldEntryID: 0,
      onFieldExitID: 0,
      outputIndex: 1,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: String(link.ONsourceID),
      sourceHandle: `ON-output-${link.ONsourceID}-${link.outputIndex}`,
      target: String(link.ONdestinationID),
      targetHandle: link.isVariablePassthrough ? `output-passthrough-${link.ONdestinationID}` : `ON-input-${link.ONdestinationID}-${link.order}`,
    };
  }

  // field to SearchNode
  if (
    checkColumnConditions(link, {
      fieldsourceID: 1,
      fielddestinationID: 0,
      ONsourceID: 0,
      ONdestinationID: 1,
      nodedestinationID: 0,
      order: 1,
      onFieldEntryID: 1,
      onFieldExitID: 0,
      outputIndex: 0,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: "API1",
      sourceHandle: String(link.fieldsourceID),
      target: String(link.ONdestinationID),
      targetHandle: `ON-input-${link.ONdestinationID}-${link.onFieldEntryID}`,
    };
  }

  // ON to SearchNode
  if (
    checkColumnConditions(link, {
      fieldsourceID: 0,
      fielddestinationID: 0,
      ONsourceID: 1,
      ONdestinationID: 1,
      nodedestinationID: 0,
      order: 1,
      onFieldEntryID: 1,
      onFieldExitID: 0,
      outputIndex: 1,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: String(link.ONsourceID),
      sourceHandle: `ON-output-${link.ONsourceID}-${link.outputIndex}`,
      target: String(link.ONdestinationID),
      targetHandle: `ON-input-${link.ONdestinationID}-${link.onFieldEntryID}`,
    };
  }

  // SearchNode to ON
  if (
    checkColumnConditions(link, {
      fieldsourceID: 0,
      fielddestinationID: 0,
      ONsourceID: 1,
      ONdestinationID: 1,
      nodedestinationID: 0,
      order: 1,
      onFieldEntryID: 0,
      onFieldExitID: 1,
      outputIndex: 1,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: String(link.ONsourceID),
      sourceHandle: `ON-output-${link.ONsourceID}-${link.onFieldExitID}`,
      target: String(link.ONdestinationID),
      targetHandle: link.isVariablePassthrough ? `output-passthrough-${link.ONdestinationID}` : `ON-input-${link.ONdestinationID}-${link.order}`,
    };
  }

  // SearchNode to field
  if (
    checkColumnConditions(link, {
      fieldsourceID: 0,
      fielddestinationID: 1,
      ONsourceID: 1,
      ONdestinationID: 0,
      nodedestinationID: 0,
      order: 0,
      onFieldEntryID: 0,
      onFieldExitID: 1,
      outputIndex: 1,
      isVariablePassthrough: 1,
    })
  ) {
    return {
      ...nodeLinks,
      source: String(link.ONsourceID),
      sourceHandle: `ON-output-${link.ONsourceID}-${link.onFieldExitID}`,
      target: "API2",
      targetHandle: String(link.fielddestinationID),
    };
  }

  //rewrite for node as ON
  // Uncomment if needed: ON to nodeAsON
  // if (checkColumnConditions(link, {
  //   fieldsourceID: 0,
  //   fielddestinationID: 1,
  //   ONsourceID: 1,
  //   ONdestinationID: 1,
  //   nodedestinationID: 0,
  //   order: 0,
  //   outputIndex: 1,
  //   isVariablePassthrough: 0,
  // })) {
  //   return {
  //     ...nodeLinks,
  //     source: link.ONsourceID,
  //     sourceHandle: `ON-output-${link.ONsourceID}-${link.outputIndex}`,
  //     target: link.nodedestinationID,
  //     targetHandle: `ON-input-${link.ONdestinationID}-${link.fielddestinationID}`,
  //   };
  // }

  // Uncomment if needed: API to nodeAsON
  // if (checkColumnConditions(link, {
  //   fieldsourceID: 1,
  //   fielddestinationID: 1,
  //   ONsourceID: 0,
  //   ONdestinationID: 1,
  //   nodedestinationID: 0,
  //   order: 0,
  //   outputIndex: 0,
  //   isVariablePassthrough: 0,
  // })) {
  //   return {
  //     ...nodeLinks,
  //     source: "API1",
  //     sourceHandle: link.fieldsourceID,
  //     target: link.ONdestinationID,
  //     targetHandle: `ON-input-${link.ONdestinationID}-${link.fielddestinationID}`,
  //   };
  // }
};

// Convert node link format to database link format
export const convertNodeToDbLinks = (sourceNode, destinationNode, sourceHandle, targetHandle) => {
  const data = {};
  const sourceNodeType = sourceNode.data.nodeType;
  const targetNodeType = destinationNode.data.nodeType;

  // Map source details based on node type
  if (sourceNodeType === NODE_TYPES.API) {
    data.fieldsourceID = Number(sourceHandle.id);
  } else if (sourceNodeType === NODE_TYPES.OPERATION) {
    data.ONsourceID = Number(sourceNode.id);
    data.outputIndex = Number(sourceHandle.data.index);

    if (sourceNode.data.ONConfig.class === "NodeAsON") {
      data.containingNodeID = Number(sourceHandle.data.nodeId);
      data.nodedestinationID = Number(destinationNode.data.nodeId);
    } else if (sourceNode.data.ONConfig.class === "Search") {
      data.onFieldExitID = Number(sourceHandle.id.split("-").slice(-1));
    }
  }

  // Map target details based on node type
  if (targetNodeType === NODE_TYPES.API) {
    data.fielddestinationID = Number(targetHandle.id);
  } else if (targetNodeType === NODE_TYPES.OPERATION) {
    data.ONdestinationID = Number(destinationNode.id);
    data.order = Number(targetHandle.data.index);

    if (destinationNode.data.ONConfig.class === "NodeAsON") {
      data.fielddestinationID = Number(targetHandle.id.split("-").slice(-1));
    } else if (destinationNode.data.ONConfig.class === "Search") {
      data.onFieldEntryID = Number(targetHandle.id.split("-").slice(-1));
    }

    if (targetHandle.data.isPassthrough) {
      data.isVariablePassthrough = true;
    }
  }

  return data;
};
