"use client";

import { Sparkles, ArrowLeftRight } from "lucide-react";

interface WordVectorsProps {
  similarities: { word1: string; word2: string; similarity: number }[];
}

export function WordVectors({ similarities }: WordVectorsProps) {
  if (!similarities.length) {
    return (
      <div className="text-zinc-400 text-center py-8 flex flex-col items-center gap-2">
        <Sparkles className="w-8 h-8 animate-pulse" />
        No word vector similarities available
      </div>
    );
  }

  // Sort by similarity
  const sorted = [...similarities].sort((a, b) => b.similarity - a.similarity);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Semantic similarity between content words (0 = unrelated, 1 = identical)</span>
      </div>

      <div className="grid gap-3">
        {sorted.map((item, i) => {
          const simPercent = Math.round(item.similarity * 100);
          const barColor =
            item.similarity > 0.7
              ? "from-green-500 to-emerald-400"
              : item.similarity > 0.4
              ? "from-yellow-500 to-amber-400"
              : "from-red-500 to-rose-400";

          return (
            <div
              key={i}
              className="group p-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-400 text-lg">
                    {item.word1}
                  </span>
                  <ArrowLeftRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                  <span className="font-bold text-purple-400 text-lg">
                    {item.word2}
                  </span>
                </div>
                <span className="text-xl font-mono font-bold text-zinc-100">
                  {(item.similarity * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${barColor} transition-all duration-500 ease-out`}
                  style={{ width: `${simPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
