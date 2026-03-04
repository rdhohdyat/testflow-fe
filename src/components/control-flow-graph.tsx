import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";

import { nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";

function ControlFlowGraph() {
  const { nodes, edges } = useCodeStore();

  return (
    <div className="flex-1 h-full w-full bg-zinc-50/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.4,
        }}
        className="bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e4e4e7"
        />
        <Controls
          className="bg-white border-none shadow-xl rounded-xl overflow-hidden"
          showInteractive={true}
        />
      </ReactFlow>
    </div>
  );
}

export default ControlFlowGraph;
