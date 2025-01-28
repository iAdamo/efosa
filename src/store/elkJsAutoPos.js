import ELK from "elkjs/lib/elk.bundled.js";

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.edgeNodeBetweenLayers": "40",
  "elk.spacing.nodeNode": "40",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
};

const elk = new ELK();

export const getNodesUpdatedPos = async (nodes, edges) => {
  console.log("nodes", nodes, "edges", edges);
  const graph = {
    id: "root",
    layoutOptions,
    children: nodes.map((n) => {
      const targetPorts = n.targetHandles.map((t) => ({
        id: t,
        properties: {
          side: "WEST",
        },
      }));

      const sourcePorts = n.sourceHandles.map((s) => ({
        id: s,
        properties: {
          side: "EAST",
        },
      }));

      return {
        id: n.id,
        width: n.measured.width + 100 ?? 150,
        height: n.measured.height + 100 ?? 50,
        properties: {
          "org.eclipse.elk.portConstraints": "FIXED_ORDER",
        },
        ports: [{ id: n.id }, ...targetPorts, ...sourcePorts],
      };
    }),

    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.sourceHandle || e.source],
      targets: [e.targetHandle || e.target],
    })),
  };

  console.log("graph", graph);

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find((lgNode) => lgNode.id === node.id);

    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    };
  });

  return layoutedNodes;
};
