"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { AnalysisResult } from "../types/data-contract";
import { cn } from "../lib/utils";

interface KnowledgeGraphProps {
    data: AnalysisResult;
    onNodeClick?: (sourceSentence: string) => void;
    className?: string;
}

interface GraphNode extends d3.SimulationNodeDatum {
    id: string;
    group: "entity" | "capability" | "constraint";
    label: string;
    sourceSentence?: string;
    radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    source: string | GraphNode;
    target: string | GraphNode;
}

export function KnowledgeGraph({ data, onNodeClick, className }: KnowledgeGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        if (!svgRef.current) return;

        // 1. Prepare Data
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        // Central Entity Node
        nodes.push({
            id: "root",
            group: "entity",
            label: data.entity,
            radius: 30,
        });

        // Capabilities
        data.capabilities.forEach((cap, i) => {
            const id = `cap-${i}`;
            nodes.push({
                id,
                group: "capability",
                label: `${cap.action} ${cap.target}`,
                sourceSentence: cap.source_sentence,
                radius: 20,
            });
            links.push({ source: "root", target: id });
        });

        // Constraints
        data.constraints.forEach((con, i) => {
            const id = `con-${i}`;
            nodes.push({
                id,
                group: "constraint",
                label: con.requirement,
                sourceSentence: con.requirement, // Constraints usually map to themselves as sentence
                radius: 20,
            });
            links.push({ source: "root", target: id });
        });

        // 2. Setup D3 Simulation
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        setDimensions({ width, height });

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        const simulation = d3
            .forceSimulation<GraphNode>(nodes)
            .force(
                "link",
                d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(150)
            )
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide<GraphNode>().radius((d) => d.radius + 10));

        // 3. Draw Elements
        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll<SVGLineElement, GraphLink>("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 2);

        const node = svg
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll<SVGGElement, GraphNode>("g")
            .data(nodes)
            .join("g")
            .call(
                d3
                    .drag<SVGGElement, GraphNode>()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

        // Node Circles
        node
            .append("circle")
            .attr("r", (d: GraphNode) => d.radius)
            .attr("fill", (d: GraphNode) => {
                if (d.group === "entity") return "#60a5fa"; // Blue 400 (Brighter)
                if (d.group === "capability") return "#4ade80"; // Green 400 (Brighter)
                if (d.group === "constraint") return "#f87171"; // Red 400 (Brighter)
                return "#e4e4e7";
            })
            .attr("class", "cursor-pointer transition-opacity hover:opacity-80")
            .on("click", (event, d: GraphNode) => {
                if (d.sourceSentence && onNodeClick) {
                    onNodeClick(d.sourceSentence);
                }
            });

        // Node Labels - Simple approach with proper fill
        node
            .append("text")
            .text((d: GraphNode) => d.label)
            .attr("x", (d: GraphNode) => d.radius + 8)
            .attr("y", 4)
            .attr("fill", "#e4e4e7") // zinc-200 for visibility
            .attr("font-size", "12px")
            .attr("font-weight", "600")
            .attr("font-family", "system-ui, sans-serif")
            .attr("class", "pointer-events-none select-none");

        // 4. Simulation Update Tick
        simulation.on("tick", () => {
            link
                .attr("x1", (d) => (d.source as GraphNode).x!)
                .attr("y1", (d) => (d.source as GraphNode).y!)
                .attr("x2", (d) => (d.target as GraphNode).x!)
                .attr("y2", (d) => (d.target as GraphNode).y!);

            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

        // Drag Functions
        function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [data, onNodeClick]);

    return (
        <div className={cn("relative w-full h-full min-h-[500px] overflow-hidden bg-zinc-900 rounded-xl border border-zinc-700", className)}>
            <svg ref={svgRef} className="w-full h-full" style={{ minHeight: "500px" }} />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 p-3 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">Entity</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">Capability</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">Constraint</span>
                </div>
            </div>
        </div>
    );
}
