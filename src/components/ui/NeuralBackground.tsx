"use client";

import { useEffect, useRef } from "react";

interface NetworkNode {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    ripple?: number;
    highlight?: boolean;
}

export default function NeuralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodesRef = useRef<NetworkNode[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const clickRippleRef = useRef<{ x: number; y: number; radius: number; alpha: number } | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Setup canvas size and responsive logic
        const resizeCanvas = () => {
            const prevWidth = canvas.width;
            const prevHeight = canvas.height;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Responsive node count based on area (approx 1 node per 15000px^2)
            // Base count 80, max 200, min 50
            const area = canvas.width * canvas.height;
            const targetNodeCount = Math.min(200, Math.max(50, Math.floor(area / 15000)));

            // If first run (prev dimensions 0 or mismatch), initialize
            if (nodesRef.current.length === 0) {
                const nodes: NetworkNode[] = [];
                for (let i = 0; i < targetNodeCount; i++) {
                    nodes.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        z: Math.random() * 400 - 200,
                        vx: (Math.random() - 0.5) * 0.8,
                        vy: (Math.random() - 0.5) * 0.8,
                        vz: (Math.random() - 0.5) * 0.5,
                        ripple: 0,
                        highlight: false
                    });
                }
                nodesRef.current = nodes;
            } else {
                // Scale node positions to maintain relative distribution
                const scaleX = prevWidth > 0 ? canvas.width / prevWidth : 1;
                const scaleY = prevHeight > 0 ? canvas.height / prevHeight : 1;

                nodesRef.current.forEach(node => {
                    node.x *= scaleX;
                    node.y *= scaleY;
                });

                // Adjust node count to target
                if (nodesRef.current.length < targetNodeCount) {
                    // Add nodes
                    for (let i = nodesRef.current.length; i < targetNodeCount; i++) {
                        nodesRef.current.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            z: Math.random() * 400 - 200,
                            vx: (Math.random() - 0.5) * 0.8,
                            vy: (Math.random() - 0.5) * 0.8,
                            vz: (Math.random() - 0.5) * 0.5,
                        });
                    }
                } else if (nodesRef.current.length > targetNodeCount) {
                    // Remove nodes
                    nodesRef.current = nodesRef.current.slice(0, targetNodeCount);
                }
            }
        };

        // Initial setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        resizeCanvas(); // Call once to init

        // Debounced resize handler
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 100);
        };
        window.addEventListener("resize", handleResize);

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Click handler for node interaction
        const handleClick = (e: MouseEvent) => {
            const clickX = e.clientX;
            const clickY = e.clientY;

            // Find clicked node
            let clickedNode: NetworkNode | null = null;
            let minDist = 30; // Click radius

            for (const node of nodesRef.current) {
                const dx = clickX - node.x;
                const dy = clickY - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    clickedNode = node;
                    minDist = dist;
                }
            }

            if (clickedNode) {
                // Feature: Double the node (mitosis effect)
                if (nodesRef.current.length < 300) {
                    nodesRef.current.push({
                        x: clickedNode.x,
                        y: clickedNode.y,
                        z: clickedNode.z,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        vz: (Math.random() - 0.5) * 0.5,
                        ripple: 1,
                        highlight: true
                    });
                }

                // Create ripple effect
                clickRippleRef.current = {
                    x: clickedNode.x,
                    y: clickedNode.y,
                    radius: 0,
                    alpha: 1
                };

                // Highlight clicked node
                clickedNode.ripple = 1;
                clickedNode.highlight = true;

                // Highlight connected nodes
                nodesRef.current.forEach(otherNode => {
                    if (otherNode !== clickedNode) {
                        const dx = clickedNode!.x - otherNode.x;
                        const dy = clickedNode!.y - otherNode.y;
                        const dz = clickedNode!.z - otherNode.z;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        if (dist < 220) {
                            otherNode.highlight = true;
                            setTimeout(() => {
                                otherNode.highlight = false;
                            }, 1000);
                        }
                    }
                });

                setTimeout(() => {
                    if (clickedNode) clickedNode.highlight = false;
                }, 1500);
            }
        };
        canvas.addEventListener("click", handleClick);

        // Animation loop
        const animate = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw ripple effect
            if (clickRippleRef.current) {
                const ripple = clickRippleRef.current;
                ripple.radius += 4;
                ripple.alpha -= 0.02;

                if (ripple.alpha > 0) {
                    ctx.strokeStyle = `rgba(59, 130, 246, ${ripple.alpha * 0.8})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.strokeStyle = `rgba(59, 130, 246, ${ripple.alpha * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, ripple.radius + 10, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    clickRippleRef.current = null;
                }
            }

            // Update and draw nodes
            nodesRef.current.forEach((node, i) => {
                // Update position
                node.x += node.vx;
                node.y += node.vy;
                node.z += node.vz;

                // Wrap around screen edges
                if (node.x < 0) node.x = canvas.width;
                if (node.x > canvas.width) node.x = 0;
                if (node.y < 0) node.y = canvas.height;
                if (node.y > canvas.height) node.y = 0;
                if (node.z < -200) node.z = 200;
                if (node.z > 200) node.z = -200;

                // Mouse interaction - gentle repulsion
                const dx = mouseRef.current.x - node.x;
                const dy = mouseRef.current.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120 && dist > 10) {
                    const force = (120 - dist) / 120;
                    node.vx -= (dx / dist) * force * 0.02;
                    node.vy -= (dy / dist) * force * 0.02;
                }

                // Apply damping
                node.vx *= 0.98;
                node.vy *= 0.98;
                node.vz *= 0.98;

                // Calculate 3D perspective
                const scale = 1 + node.z / 400;
                const size = node.highlight ? 4 * scale : 2.5 * scale;
                const opacity = node.highlight ? 1 : 0.4 + (node.z + 200) / 800;

                // Draw node with glow if highlighted
                if (node.highlight) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = "rgba(59, 130, 246, 0.8)";
                }
                ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw connections
                for (let j = i + 1; j < nodesRef.current.length; j++) {
                    const otherNode = nodesRef.current[j];
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;

                    // Quick distance check
                    if (Math.abs(dx) > 200 || Math.abs(dy) > 200) continue;

                    const dz = node.z - otherNode.z;
                    const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist3D < 220) {
                        const lineOpacity = (1 - dist3D / 220) * 0.4;
                        ctx.strokeStyle = `rgba(59, 130, 246, ${lineOpacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("click", handleClick);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 bg-black cursor-pointer"
        />
    );
}
