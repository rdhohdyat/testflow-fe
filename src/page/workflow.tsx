import { Navbar } from "../components/navbar";
import { Code, GitFork, BarChart3, GitBranch } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "@xyflow/react";
import CodeEditor from "../components/code-editor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";

import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../data/node";
import { useCodeStore } from "../store/CodeStore";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import ServerStatus from "../components/server-status";
import PathList from "../components/path-list";
import TestCase from "../components/test-case";
import CoveragePath from "../components/coverage-path";
import {
  Card,
} from "../components/ui/card";
import { SaveAnalysisDialog } from "../components/save-analysis-dialog";
import { getComplexityInfo } from "../utils/complexity";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

function WorkFlowPage() {
  const {
    rawEdges,
    rawNodes,
    nodes: storeNodes,
    edges: storeEdges,
    triggerAnimation,
    setNodeCount,
    setEdgeCount,
    nodeCount,
    edgeCount,
    cyclomaticComplexity,
    setTriggerAnimation,
  } = useCodeStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    const sourceNodes = rawNodes && rawNodes.length > 0 ? rawNodes : storeNodes;
    const sourceEdges = rawEdges && rawEdges.length > 0 ? rawEdges : storeEdges;

    if (sourceNodes && sourceNodes.length > 0) {
      setNodeCount(sourceNodes.length);
      if (sourceEdges && sourceEdges.length > 0) {
        setEdgeCount(sourceEdges.length);
      }
    }
  }, [rawNodes, rawEdges, storeNodes, storeEdges, setNodeCount, setEdgeCount]);

  const animateNodesAndEdges = useCallback(() => {
    setNodes([]);
    setEdges([]);
    const sourceNodes = rawNodes && rawNodes.length > 0 ? rawNodes : storeNodes;
    const sourceEdges = rawEdges && rawEdges.length > 0 ? rawEdges : storeEdges;

    if (sourceNodes && sourceNodes.length > 0) {
      sourceNodes.forEach((node, index) => {
        setTimeout(() => {
          // @ts-ignore
          setNodes((prevNodes) => [...prevNodes, { ...node }]);
        }, index * 100); // Dipercepat sedit agar lebih responsif
      });
    }

    if (sourceEdges && sourceEdges.length > 0) {
      sourceEdges.forEach((edge, index) => {
        setTimeout(() => {
          // @ts-ignore
          setEdges((prevEdges) => [...prevEdges, { ...edge }]);
        }, index * 100); // Dipercepat sedikit agar lebih responsif
      });
    }
  }, [rawNodes, rawEdges, storeNodes, storeEdges, setNodes, setEdges]);

  useEffect(() => {
    if (triggerAnimation) {
      animateNodesAndEdges();
      setInitialRender(false);
      // Reset trigger agar tidak animasi ulang saat navigasi
      setTriggerAnimation(null);
    }
  }, [triggerAnimation, animateNodesAndEdges, setTriggerAnimation]);

  useEffect(() => {
    // Hanya lakukan render instan jika bukan sedang dalam proses animasi (triggerAnimation null)
    if (initialRender && storeNodes.length > 0 && !triggerAnimation) {
      // @ts-ignore
      setNodes(storeNodes);
      // @ts-ignore
      setEdges(storeEdges);
      setInitialRender(false);
    }
  }, [initialRender, storeNodes, storeEdges, setNodes, setEdges, triggerAnimation]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans tracking-tight"
    >
      <motion.div variants={itemVariants}>
        <Navbar />
      </motion.div>

      {/* Mobile View */}
      <div className="block px-3 pt-32 pb-10 xl:hidden">
        <motion.div variants={itemVariants} className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <ServerStatus />
            <SaveAnalysisDialog />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-neutral-100/50 rounded-xl sticky top-28 z-10 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50">
              <TabsTrigger value="editor" className="rounded-xl font-bold text-xs h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none transition-all">
                <Code className="w-4 h-4 mr-2" /> Editor
              </TabsTrigger>
              <TabsTrigger value="graph" className="rounded-xl font-bold text-xs h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none transition-all">
                <GitFork className="w-4 h-4 mr-2" /> Grafik
              </TabsTrigger>
              <TabsTrigger value="analysis" className="rounded-xl font-bold text-xs h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none transition-all">
                <BarChart3 className="w-4 h-4 mr-2" /> Analisis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-0 focus-visible:outline-none">
              <div className="rounded-2xl bg-white dark:bg-neutral-900 shadow-xl dark:shadow-none overflow-hidden h-[50vh] border-none">
                <CodeEditor />
              </div>
            </TabsContent>

            <TabsContent value="graph" className="mt-0 focus-visible:outline-none">
              <div className="rounded-2xl bg-white dark:bg-neutral-900 shadow-xl dark:shadow-none overflow-hidden h-[50vh] flex flex-col border-none">
                <div className="p-6 border-b border-neutral-50 dark:border-neutral-800 flex justify-between items-center bg-white/50 dark:bg-neutral-900/50">
                  <span className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">Control Flow Graph</span>
                  <Badge className="bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                    {nodeCount} Node • {edgeCount} Edge
                  </Badge>
                </div>
                <div className="flex-1">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                  >
                    <Background variant={BackgroundVariant.Dots} gap={12} />
                    <Controls />
                  </ReactFlow>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0 space-y-6 focus-visible:outline-none">
              <Card className="rounded-2xl border-none shadow-xl dark:shadow-none p-8 bg-white dark:bg-neutral-900 text-black dark:text-white">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-2">Metrik Kompleksitas</h3>
                    <div className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                      E - N + 2 = <span className="italic text-emerald-500">{edgeCount - nodeCount + 2}</span>
                    </div>
                  </div>
                  {(() => {
                    const info = getComplexityInfo(edgeCount - nodeCount + 2);
                    return (
                      <Badge className={`${info.bgColor} ${info.color} border-none font-bold text-[10px] py-1 px-3 rounded-lg`}>
                        {info.label}
                      </Badge>
                    );
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-2 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Nodes</p>
                    <p className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">{nodeCount}</p>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-2 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Edges</p>
                    <p className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">{edgeCount}</p>
                  </div>
                </div>
              </Card>

              <Tabs defaultValue="metrics_sub" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-2xl">
                  <TabsTrigger value="metrics_sub" className="rounded-xl font-bold text-xs h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none transition-all">Daftar Jalur</TabsTrigger>
                  <TabsTrigger value="testcase_sub" className="rounded-xl font-bold text-xs h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none transition-all">Test Case</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics_sub" className="space-y-6">
                  <CoveragePath />
                  <PathList />
                </TabsContent>
                <TabsContent value="testcase_sub">
                  <TestCase />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <div className="hidden px-20 pt-28 pb-8 xl:flex h-screen max-h-screen overflow-hidden flex-col">
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
          <ServerStatus />
          <SaveAnalysisDialog />
        </motion.div>

        <motion.div
          variants={scaleVariants}
          className="flex-1 rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden border dark:border-neutral-900"
        >
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
          >
            <ResizablePanel minSize={20} defaultSize={25} className="bg-neutral-50/50 dark:bg-neutral-900">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <CodeEditor />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={40} defaultSize={50} className="bg-white dark:bg-neutral-900">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm z-10 sticky top-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-emerald-500 flex items-center justify-center">
                      <GitFork className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-neutral-500 dark:text-white uppercase">Visualisasi CFG</span>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500 border-none font-bold text-[10px] tracking-tight">
                    {nodeCount} Node • {edgeCount} Edge
                  </Badge>
                </div>
                <div className="flex-1 relative">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    fitViewOptions={{ maxZoom: 0.8, minZoom: 0.5 }}
                  >
                    <Background variant={BackgroundVariant.Dots} gap={12} />
                    <Controls className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xl dark:shadow-none" />
                  </ReactFlow>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel minSize={20} defaultSize={25} className="bg-neutral-50 dark:bg-neutral-800/20">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2 bg-white/50 dark:bg-neutral-900/50">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-emerald-500 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-neutral-500 dark:text-white uppercase">Metrik Hasil</span>
                </div>

                <Tabs defaultValue="metrics" className="flex flex-col flex-1 overflow-hidden">
                  <div className="px-6 mt-3">
                    <TabsList className="grid grid-cols-2 p-1 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-2xl border-none">
                      <TabsTrigger value="metrics" className="rounded-xl font-black text-[10px] h-10 uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none transition-all py-2">
                        Metrik
                      </TabsTrigger>
                      <TabsTrigger value="testcase" className="rounded-xl font-black text-[10px] h-10 uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none transition-all py-2">
                        Kasus Uji
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="metrics" className="flex-1 px-5 pb-2 overflow-y-auto space-y-3 custom-scrollbar focus-visible:outline-none">
                    <Card className="dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-neutral-100/50 dark:shadow-none p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <GitBranch className="w-4  h-4" />
                        </div>
                        <h3 className="text-xs font-bold tracking-wider text-neutral-500 dark:text-white uppercase">Kompleksitas Siklomatis</h3>
                      </div>

                      <div className="flex flex-wrap justify-between items-center w-full mt-3">
                        <div className="flex items-center gap-2 text-black dark:bg-neutral-900 dark:text-white px-3 py-1.5 rounded-lg">
                          <span className="font-mono text-black dark:text-white font-semibold text-xs">
                            V(G) = E - N + 2
                          </span>
                          <span className="text-black dark:text-white font-bold">=</span>
                          <span className="text-lg font-black tracking-tight tabular-nums text-emerald-400">
                            {cyclomaticComplexity}
                          </span>
                        </div>

                        {(() => {
                          const info = getComplexityInfo(cyclomaticComplexity);
                          return (
                            <Badge className={`${info.bgColor} ${info.color} border-none font-bold text-[10px] py-1.5 px-3 rounded-xl`}>
                              {info.label}
                            </Badge>
                          );
                        })()}
                      </div>

                      <div className="flex justify-center items-center p-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] font-black text-neutral-400 dark:text-white uppercase tracking-widest">Edge</span>
                          <span className="text-sm font-black text-neutral-900 dark:text-white tabular-nums">
                            {edgeCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5">
                          <span className="text-[10px] font-black text-neutral-400 dark:text-white uppercase tracking-widest">Node</span>
                          <span className="text-sm font-black text-neutral-900 dark:text-white tabular-nums">
                            {nodeCount}
                          </span>
                        </div>
                      </div>
                    </Card>
                    <CoveragePath />
                    <PathList />
                  </TabsContent>

                  <TabsContent value="testcase" className="flex-1 p-0 overflow-y-auto custom-scrollbar focus-visible:outline-none h-full">
                    <div className="px-6">
                      <TestCase />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default WorkFlowPage;