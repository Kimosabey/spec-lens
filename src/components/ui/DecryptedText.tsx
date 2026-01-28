"use client";

import { useEffect, useState, useRef } from "react";

interface DecryptedTextProps {
    text: string;
    speed?: number;
    maxIterations?: number;
    className?: string;
    revealDirection?: "start" | "end" | "center";
    useOriginalCharsOnly?: boolean;
}

export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    className = "",
    revealDirection = "start",
    useOriginalCharsOnly = false,
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let currentIteration = 0;

        if (isScrambling) {
            interval = setInterval(() => {
                setDisplayText((prevText) =>
                    prevText
                        .split("")
                        .map((char, index) => {
                            if (revealedIndices.has(index) || char === " ") {
                                return text[index];
                            }

                            if (Math.random() < 0.1) {
                                const revealProb = currentIteration / maxIterations;
                                if (Math.random() < revealProb) {
                                    setRevealedIndices((prev) => new Set(prev).add(index));
                                    return text[index];
                                }
                            }

                            if (useOriginalCharsOnly) {
                                const originalChars = Array.from(new Set(text.split(""))).filter((c) => c !== " ");
                                return originalChars[Math.floor(Math.random() * originalChars.length)];
                            }

                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join("")
                );

                currentIteration++;
                if (currentIteration > maxIterations + 15) { // Ensure cleanup
                    setDisplayText(text);
                    setIsScrambling(false);
                    clearInterval(interval);
                }
            }, speed);
        } else {
            setDisplayText(text); // Reset
        }

        return () => clearInterval(interval);
    }, [isScrambling, text, speed, maxIterations, revealedIndices, useOriginalCharsOnly]);

    // Trigger on hover
    const navRef = useRef<HTMLSpanElement>(null);

    return (
        <span
            ref={navRef}
            className={className}
            onMouseEnter={() => {
                setIsScrambling(true);
                setRevealedIndices(new Set());
            }}
        >
            {displayText}
        </span>
    );
}
