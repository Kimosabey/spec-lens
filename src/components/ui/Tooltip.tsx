"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            let top = 0;
            let left = 0;

            // Simple positioning logic (can be expanded for viewport awareness)
            switch (position) {
                case "top":
                    top = rect.top + scrollY - 10;
                    left = rect.left + scrollX + rect.width / 2;
                    break;
                case "bottom":
                    top = rect.bottom + scrollY + 10;
                    left = rect.left + scrollX + rect.width / 2;
                    break;
                case "left":
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.left + scrollX - 10;
                    break;
                case "right":
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.right + scrollX + 10;
                    break;
            }

            setCoords({ top, left });
        }
    }, [isVisible, position]);

    return (
        <div
            ref={triggerRef}
            className="relative inline-flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible &&
                createPortal(
                    <div
                        className="absolute z-[9999] pointer-events-none"
                        style={{ top: coords.top, left: coords.left }}
                    >
                        <div
                            className={`
                max-w-xs sm:max-w-sm p-3 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-zinc-700 shadow-2xl text-sm text-zinc-100 animate-in fade-in zoom-in-95 duration-200
                ${position === "top" ? "-translate-x-1/2 -translate-y-full" : ""}
                ${position === "bottom" ? "-translate-x-1/2" : ""}
                ${position === "left" ? "-translate-x-full -translate-y-1/2" : ""}
                ${position === "right" ? "-translate-y-1/2" : ""}
              `}
                        >
                            <div className="relative z-10">{content}</div>
                            {/* Simple arrow */}
                            <div
                                className={`absolute w-3 h-3 bg-zinc-900 border-zinc-700 transform rotate-45 z-0
                  ${position === "top" ? "bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r" : ""}
                  ${position === "bottom" ? "top-[-5px] left-1/2 -translate-x-1/2 border-t border-l" : ""}
                `}
                            />
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}

// Tab info with descriptions and examples
export const TAB_INFO: Record<string, { description: string; example: string }> = {
    "full-analysis": {
        description: "Complete overview showing the primary entity, all capabilities, and constraints extracted from your text.",
        example: "Entity: 'iPhone' | Capabilities: 'supports Face ID' | Constraints: 'must be charged daily'"
    },
    "token-explorer": {
        description: "View every word (token) with its linguistic properties: lemma, part of speech, dependencies, and more.",
        example: "'running' → lemma: 'run', POS: VERB, dep: ROOT"
    },
    "text-stats": {
        description: "Quantitative statistics about your text including word count, sentence count, and averages.",
        example: "Words: 150, Sentences: 8, Avg Word Length: 5.2"
    },
    "named-entities": {
        description: "Named Entity Recognition (NER) identifies people, organizations, locations, dates, and more.",
        example: "'Apple' → ORG, 'Steve Jobs' → PERSON, '1976' → DATE"
    },
    "part-of-speech": {
        description: "Part of Speech (POS) tagging classifies each word as noun, verb, adjective, etc.",
        example: "'The quick brown fox' → DET ADJ ADJ NOUN"
    },
    "dependencies": {
        description: "Syntactic dependencies show grammatical relationships between words in a sentence.",
        example: "'dog bites man' → dog(nsubj) ← bites(ROOT) → man(dobj)"
    },
    "knowledge-graph": {
        description: "Interactive graph visualization showing relationships between the main entity and its capabilities/constraints.",
        example: "Central node: 'System X' connected to 'supports trading' and 'must initialize'"
    },
    "word-vectors": {
        description: "Semantic similarity using word embeddings. Higher scores = more similar meanings.",
        example: "'king' ↔ 'queen': 0.78 (similar), 'king' ↔ 'pizza': 0.12 (unrelated)"
    },
    "lemmatization": {
        description: "Reduces words to their dictionary base form (lemma).",
        example: "'running' → 'run', 'better' → 'good', 'mice' → 'mouse'"
    },
    "sentences": {
        description: "Sentence segmentation breaks text into individual sentences with their syntactic roots.",
        example: "Sentence 1: 'The system initializes.' Root: 'initializes'"
    },
    "stop-words": {
        description: "Separates common function words (stop words) from meaningful content words.",
        example: "Stop: 'the, is, and' | Content: 'system, process, analyze'"
    },
    "model-info": {
        description: "Information about the spaCy NLP model including version, pipeline components, and word vector stats.",
        example: "Model: en_core_web_lg, Vectors: 684,830, Dimensions: 300"
    },
};

interface InfoButtonProps {
    tabId: string;
}

export function InfoButton({ tabId }: InfoButtonProps) {
    const info = TAB_INFO[tabId];
    if (!info) return null;

    return (
        <Tooltip
            content={
                <div className="space-y-2">
                    <p className="font-medium text-zinc-100">{info.description}</p>
                    <div className="pt-2 border-t border-zinc-700/50">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Example</span>
                        <p className="text-blue-300 font-mono text-xs mt-1 bg-black/30 p-1.5 rounded border border-white/5">{info.example}</p>
                    </div>
                </div>
            }
            position="bottom"
        >
            <div className="p-1 rounded-full hover:bg-zinc-700/50 transition-colors">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-500 hover:text-blue-400 cursor-help" />
            </div>
        </Tooltip>
    );
}
