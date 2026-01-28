"use client";

import { Sentence } from "@/types/data-contract";
import { AlignLeft, CircleDot, Hash } from "lucide-react";

interface SentencesProps {
  sentences: Sentence[];
}

export function Sentences({ sentences }: SentencesProps) {
  if (!sentences.length) {
    return <div className="text-zinc-400 text-center py-8">No sentences found</div>;
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        <AlignLeft className="w-4 h-4" />
        <span>Sentence segmentation with syntactic roots</span>
      </div>

      <div className="space-y-3">
        {sentences.map((sentence, i) => (
          <div
            key={i}
            className="group p-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-zinc-100 text-base leading-relaxed">{sentence.text}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <CircleDot className="w-3 h-3 text-green-400" />
                    Root: <span className="font-semibold text-green-400">{sentence.root}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Chars: {sentence.start}-{sentence.end}
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span>{sentence.text.length} characters</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
