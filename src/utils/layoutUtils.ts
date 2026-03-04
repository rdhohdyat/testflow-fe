import dagre from "@dagrejs/dagre";
import { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 100;
const NODE_HEIGHT = 50;

/**
 * Applies Dagre auto-layout to a list of nodes and edges.
 * Returns new nodes with updated positions.
 */
export function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
): Node[] {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    align: "UL",
    nodesep: 50,   // horizontal spacing between nodes on same rank
    ranksep: 60,   // vertical spacing between ranks
    marginx: 20,
    marginy: 20,
    ranker: "network-simplex", // best layout algorithm for CFGs
  });

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to dagre (skip loop-back edges so they don't affect rank)
  edges.forEach((edge) => {
    const isLoopBack = (edge as any).label === "loop back";
    if (!isLoopBack) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  // Return nodes with updated positions from Dagre
  return nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        // Dagre gives center point; ReactFlow uses top-left
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
      },
    };
  });
}
