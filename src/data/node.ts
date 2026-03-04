import { MarkerType } from "@xyflow/react";
import node from "../components/ui/node";

export const initialNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 350, y: 30 },
    data: { label: "1" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 350, y: 120 },
    data: { label: "2" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 450, y: 210 },
    data: { label: "3" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 350, y: 230 },
    data: { label: "4-5" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 350, y: 320 },
    data: { label: "end" },
  },
];

export const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { strokeWidth: 2, stroke: "#94a3b8" },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    label: "false",
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { strokeWidth: 2, stroke: "#94a3b8" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    label: "true",
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { strokeWidth: 2, stroke: "#94a3b8" },
  },
  {
    id: "e4-3",
    source: "4",
    target: "5",
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { strokeWidth: 2, stroke: "#94a3b8" },
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { strokeWidth: 2, stroke: "#94a3b8" },
  },
];

export const nodeTypes = {
  custom: node,
};
