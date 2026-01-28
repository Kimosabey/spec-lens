"use client";

import { Filter, Sparkles, Ban } from "lucide-react";

interface StopWordsProps {
    stopWords: string[];
    contentWords: string[];
}

export function StopWords({ stopWords, contentWords }: StopWordsProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Content Words */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">
                    <Sparkles className="w-4 h-4" />
                    Content Words ({contentWords.length})
                </h3>
                <p className="text-xs text-green-400/70 mb-4">
                    Meaningful words that carry semantic content
                </p>
                <div className="flex flex-wrap gap-2">
                    {contentWords.map((word, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-sm font-medium border border-green-500/30 hover:bg-green-500/30 hover:scale-105 transition-all duration-200 cursor-default"
                            style={{ animationDelay: `${i * 20}ms` }}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stop Words */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
                    <Ban className="w-4 h-4" />
                    Stop Words ({stopWords.length})
                </h3>
                <p className="text-xs text-red-400/70 mb-4">
                    Common words typically filtered in text processing
                </p>
                <div className="flex flex-wrap gap-2">
                    {stopWords.map((word, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm border border-red-500/30 hover:bg-red-500/30 transition-colors duration-200 cursor-default"
                            style={{ animationDelay: `${i * 20}ms` }}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
