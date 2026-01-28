"use client";

import { Dependency } from "@/types/data-contract";
import { GitBranch, ArrowRight, CircleDot } from "lucide-react";

interface DependenciesProps {
    dependencies: Dependency[];
}

export function Dependencies({ dependencies }: DependenciesProps) {
    if (!dependencies.length) {
        return <div className="text-zinc-500 text-center py-8">No dependencies to display</div>;
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
                <GitBranch className="w-4 h-4" />
                <span>Syntactic dependency relations between tokens</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-800">
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-medium text-left text-zinc-700 dark:text-zinc-300">Token</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-medium text-left text-zinc-700 dark:text-zinc-300">Relation</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-medium text-left text-zinc-700 dark:text-zinc-300">Head</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-medium text-left text-zinc-700 dark:text-zinc-300">Children</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900/50">
                        {dependencies.map((dep, i) => (
                            <tr
                                key={i}
                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-150"
                                style={{ animationDelay: `${i * 20}ms` }}
                            >
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800 font-mono font-bold text-blue-600 dark:text-blue-400">
                                    {dep.token}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-500/30">
                                        {dep.dep}
                                    </span>
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                    {dep.head === dep.token ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-500/30">
                                            <CircleDot className="w-3 h-3" />
                                            ROOT
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                                            <ArrowRight className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                            <span className="font-medium">{dep.head}</span>
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                    {dep.children.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {dep.children.map((child, j) => (
                                                <span
                                                    key={j}
                                                    className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-transparent"
                                                >
                                                    {child}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-zinc-400 dark:text-zinc-600 text-xs">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
