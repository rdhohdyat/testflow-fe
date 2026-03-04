import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import TooltipComponent from "../tooltip-component";

const Node = ({ data, selected }: any) => {
  return (
    <TooltipComponent information={data.tooltip}>
      <div className={cn(
        "group relative flex items-center justify-center w-12 h-12",
        "bg-white/90 backdrop-blur-xl rounded-full border-2 transition-all duration-300 cursor-pointer",
        selected
          ? "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] scale-110"
          : "border-gray-600 shadow-xl shadow-zinc-200/40 hover:border-zinc-400 hover:scale-105"
      )}>
        {/* Inner Glow/Highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none" />

        <span className="relative text-[11px] font-black uppercase tracking-widest text-zinc-900 leading-none">
          {data.label}
        </span>

        {/* --- Handles for Routing --- */}
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="w-2.5 h-2.5 !bg-zinc-800 border-2 border-white !opacity-0 group-hover:!opacity-100 transition-opacity"
        />

        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="w-2.5 h-2.5 !bg-zinc-800 border-2 border-white !opacity-0 group-hover:!opacity-100 transition-opacity"
        />

        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          className="w-2 h-2 !bg-zinc-800 border-2 border-white !opacity-0 group-hover:!opacity-100 transition-opacity"
        />
        <Handle
          type="target"
          position={Position.Right}
          id="right"
          className="w-2 h-2 !bg-white border-2 border-zinc-500 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />

        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          className="w-2 h-2 !bg-zinc-800 border-2 border-white !opacity-0 group-hover:!opacity-100 transition-opacity"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="w-2 h-2 !bg-white border-2 border-zinc-500 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />
      </div>
    </TooltipComponent>
  );
};

export default memo(Node);
