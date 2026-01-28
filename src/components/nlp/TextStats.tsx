"use client";

import { TextStats as TextStatsType } from "@/types/data-contract";
import {
    Type,
    BookOpen,
    FileText,
    Hash,
    Target,
    Ruler,
    LayoutList,
    StopCircle,
    PenTool
} from "lucide-react";

interface TextStatsProps {
    stats: TextStatsType;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
    return (
        <div className="group p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {typeof value === "number" ? value.toLocaleString() : value}
            </div>
        </div>
    );
}

export function TextStats({ stats }: TextStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatCard icon={Type} label="Characters" value={stats.char_count} />
            <StatCard icon={BookOpen} label="Words" value={stats.word_count} />
            <StatCard icon={FileText} label="Sentences" value={stats.sentence_count} />
            <StatCard icon={Hash} label="Tokens" value={stats.token_count} />
            <StatCard icon={Target} label="Unique Tokens" value={stats.unique_tokens} />
            <StatCard icon={Ruler} label="Avg Word Length" value={stats.avg_word_length.toFixed(1)} />
            <StatCard icon={LayoutList} label="Avg Sentence Len" value={stats.avg_sentence_length.toFixed(1)} />
            <StatCard icon={StopCircle} label="Stop Words" value={stats.stop_word_count} />
            <StatCard icon={PenTool} label="Punctuation" value={stats.punctuation_count} />
        </div>
    );
}
