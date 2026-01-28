"use client";

import { Token } from "@/types/data-contract";
import { Tags, BarChart3 } from "lucide-react";

interface PartOfSpeechProps {
    tokens: Token[];
}

const POS_COLORS: Record<string, string> = {
    NOUN: "bg-blue-500 text-white",
    VERB: "bg-red-500 text-white",
    ADJ: "bg-green-500 text-white",
    ADV: "bg-purple-500 text-white",
    PRON: "bg-pink-500 text-white",
    DET: "bg-yellow-500 text-black",
    ADP: "bg-orange-500 text-white",
    CONJ: "bg-cyan-500 text-white",
    CCONJ: "bg-cyan-500 text-white",
    SCONJ: "bg-teal-500 text-white",
    NUM: "bg-lime-500 text-black",
    PUNCT: "bg-zinc-500 text-white",
    SYM: "bg-zinc-600 text-white",
    X: "bg-zinc-700 text-white",
    INTJ: "bg-rose-500 text-white",
    PART: "bg-indigo-500 text-white",
    PROPN: "bg-sky-500 text-white",
    AUX: "bg-amber-500 text-black",
    SPACE: "bg-transparent text-zinc-400",
};

export function PartOfSpeech({ tokens }: PartOfSpeechProps) {
    if (!tokens.length) {
        return <div className="text-zinc-400 text-center py-8">No tokens to display</div>;
    }

    // Get unique POS tags for legend
    const uniquePOS = [...new Set(tokens.map((t) => t.pos).filter((p) => p !== "SPACE"))];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Legend */}
            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <span className="flex items-center gap-2 text-zinc-400 text-sm mr-4">
                    <Tags className="w-4 h-4" />
                    Legend:
                </span>
                {uniquePOS.map((pos, i) => (
                    <span
                        key={pos}
                        className={`px-2 py-1 rounded text-xs font-bold ${POS_COLORS[pos] || "bg-zinc-600 text-white"}`}
                        style={{ animationDelay: `${i * 30}ms` }}
                    >
                        {pos}
                    </span>
                ))}
            </div>

            {/* Inline visualization */}
            <div className="flex flex-wrap gap-2 p-6 rounded-xl bg-zinc-900 border border-zinc-700">
                {tokens.map((token, i) => (
                    <span
                        key={i}
                        className="inline-flex flex-col items-center group hover:scale-105 transition-transform duration-200"
                        style={{ animationDelay: `${i * 10}ms` }}
                    >
                        <span className="text-base font-medium text-zinc-100 mb-1">
                            {token.text}
                        </span>
                        <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${POS_COLORS[token.pos] || "bg-zinc-600 text-white"}`}
                        >
                            {token.pos}
                        </span>
                    </span>
                ))}
            </div>

            {/* Statistics */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    <BarChart3 className="w-4 h-4" />
                    Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uniquePOS.map((pos, i) => {
                        const count = tokens.filter((t) => t.pos === pos).length;
                        const percent = Math.round((count / tokens.length) * 100);
                        return (
                            <div
                                key={pos}
                                className="group flex items-center justify-between p-3 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-blue-500 transition-all duration-300"
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded ${POS_COLORS[pos]?.split(" ")[0] || "bg-zinc-600"}`}></span>
                                    <span className="text-sm font-medium text-zinc-200">{pos}</span>
                                </span>
                                <span className="text-sm text-zinc-400 font-mono">{count} <span className="text-zinc-600">({percent}%)</span></span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
