import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import TooltipComponent from "../tooltip-component";

const Node = ({ data, selected }: any) => {
  return (
    <TooltipComponent information={data.tooltip}>
      <div className={cn(
        "group relative flex items-center justify-center w-12 h-12",
        // BG: Putih di light mode, Abu-abu gelap di dark mode
        "bg-white/90 dark:bg-gray-800 backdrop-blur-xl rounded-full border-2 transition-all duration-300 cursor-pointer",
        selected
          ? "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] scale-110"
          : "border-gray-400 dark:border-gray-600 shadow-xl shadow-gray-200/40 dark:shadow-none hover:border-gray-400 hover:scale-105"
      )}>
        {/* Inner Glow: Kita sembunyikan sedikit di dark mode agar tidak terlalu terang */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/40 dark:via-white/5 to-white/0 pointer-events-none" />

        {/* TEXT: gray-900 di light mode, Putih di dark mode */}
        <span className="relative text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white leading-none">
          {data.label}
        </span>

        {/* --- Handles for Routing --- */}
        {/* Kita sesuaikan border handle agar tidak 'hilang' di background gelap */}
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="w-2.5 h-2.5 !bg-gray-800 dark:!bg-emerald-500 border-2 border-white dark:border-gray-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />

        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="w-2.5 h-2.5 !bg-gray-800 dark:!bg-emerald-500 border-2 border-white dark:border-gray-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />

        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          className="w-2 h-2 !bg-gray-800 dark:!bg-gray-400 border-2 border-white dark:border-gray-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />
        <Handle
          type="target"
          position={Position.Right}
          id="right"
          className="w-2 h-2 !bg-white dark:!bg-gray-600 border-2 border-gray-500 dark:border-gray-400 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />

        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          className="w-2 h-2 !bg-gray-800 dark:!bg-gray-400 border-2 border-white dark:border-gray-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="w-2 h-2 !bg-white dark:!bg-gray-600 border-2 border-gray-500 dark:border-gray-400 !opacity-0 group-hover:!opacity-100 transition-opacity"
        />
      </div>
    </TooltipComponent>
  );
};

export default memo(Node);