"use client";

import { Token } from "@/types/data-contract";
import { Table, Search } from "lucide-react";
import { useState } from "react";

interface TokenExplorerProps {
    tokens: Token[];
}

export function TokenExplorer({ tokens }: TokenExplorerProps) {
    const [filter, setFilter] = useState("");

    const filteredTokens = tokens.filter(
        (t) =>
            t.text.toLowerCase().includes(filter.toLowerCase()) ||
            t.pos.toLowerCase().includes(filter.toLowerCase()) ||
            t.dep.toLowerCase().includes(filter.toLowerCase())
    );

    if (!tokens.length) {
        return <div className="text-zinc-500 text-center py-8">No tokens to display</div>;
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Filter tokens by text, POS, or dependency..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                />
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-800 text-left">
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-medium text-zinc-700 dark:text-zinc-300">
                                <div className="flex items-center gap-2">
                                    <Table className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                    Token
                                </div>
                            </th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Lemma</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">POS</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Tag</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Dep</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Head</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Shape</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Entity</th>
                            <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Stop</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900/50">
                        {filteredTokens.map((token, i) => (
                            <tr
                                key={i}
                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-150"
                                style={{ animationDelay: `${i * 20}ms` }}
                            >
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800 font-mono font-semibold text-blue-600 dark:text-blue-400">
                                    {token.text}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800 text-purple-600 dark:text-purple-400">
                                    {token.lemma}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium">
                                        {token.pos}
                                    </span>
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-500 text-xs">
                                    {token.tag}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-medium">
                                        {token.dep}
                                    </span>
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                                    {token.head}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800 font-mono text-xs text-zinc-500">
                                    {token.shape}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                    {token.ent_type && (
                                        <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs font-medium animate-pulse">
                                            {token.ent_type}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 border-b border-zinc-100 dark:border-zinc-800 text-center">
                                    {token.is_stop && (
                                        <span className="inline-block w-2 h-2 rounded-full bg-red-400 dark:bg-red-500"></span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-zinc-500 text-right">
                Showing {filteredTokens.length} of {tokens.length} tokens
            </p>
        </div>
    );
}
