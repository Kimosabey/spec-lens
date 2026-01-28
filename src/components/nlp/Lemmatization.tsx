"use client";

import { ArrowRight, Wand2, BookOpen } from "lucide-react";

interface LemmatizationProps {
    lemmas: { original: string; lemma: string }[];
}

export function Lemmatization({ lemmas }: LemmatizationProps) {
    if (!lemmas.length) {
        return <div className="text-zinc-400 text-center py-8">No lemmas to display</div>;
    }

    // Filter to only show words where lemma differs from original
    const changed = lemmas.filter((l) => l.original.toLowerCase() !== l.lemma.toLowerCase());
    const unchanged = lemmas.filter((l) => l.original.toLowerCase() === l.lemma.toLowerCase());

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Intro */}
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Wand2 className="w-4 h-4" />
                <span>Reducing words to their base dictionary forms</span>
            </div>

            {/* Changed lemmas */}
            {changed.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        Transformed Words ({changed.length})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {changed.map((item, i) => (
                            <div
                                key={i}
                                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10"
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <span className="font-medium text-zinc-200">{item.original}</span>
                                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                                <span className="font-bold text-purple-400">{item.lemma}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Unchanged lemmas */}
            {unchanged.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                        <BookOpen className="w-4 h-4 text-green-400" />
                        Base Forms ({unchanged.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {unchanged.map((item, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium border border-zinc-700 hover:border-zinc-500 transition-colors"
                                style={{ animationDelay: `${i * 10}ms` }}
                            >
                                {item.original}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
