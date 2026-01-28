"use client";

import { ModelInfo as ModelInfoType } from "@/types/data-contract";
import { Cpu, Globe, Box, Layers, Zap, Database, Key } from "lucide-react";

interface ModelInfoProps {
    info: ModelInfoType;
}

// Map pipeline components to their descriptions and roles
const PIPELINE_DESCRIPTIONS: Record<string, { role: string; desc: string }> = {
    "tok2vec": { role: "Token to Vector", desc: "Converts text into numerical vectors, capturing semantic meaning." },
    "tagger": { role: "Part-of-Speech Tagger", desc: "Assigns grammatical categories (noun, verb, etc.) to tokens." },
    "parser": { role: "Dependency Parser", desc: "Analyzes grammatical structure and relationships between words." },
    "attribute_ruler": { role: "Attribute Ruler", desc: "Sets rules for token attributes and exception handling." },
    "lemmatizer": { role: "Lemmatizer", desc: "Reduces words to their base or dictionary form (e.g., 'running' -> 'run')." },
    "ner": { role: "Named Entity Recognizer", desc: "Identifies real-world objects like persons, companies, and locations." },
    "custom_ner": { role: "Custom Entity Recognizer", desc: "Specialized rule-based matching for domain-specific entities." },
    "capability_extractor": { role: "Capability Extractor", desc: "Identifies functional capabilities and actions." },
    "constraint_extractor": { role: "Constraint Extractor", desc: "Detects limitations, rules, and mandatory requirements." },
    "senter": { role: "Sentence Segmenter", desc: "Splits text into individual sentences." },
};

export function ModelInfo({ info }: ModelInfoProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Model Header */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700"></div>
                <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 rounded-xl bg-blue-500/20 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Cpu className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1 opacity-80">Active Neural Network</div>
                            <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">
                                {info.name}
                            </h2>
                            <p className="text-zinc-400 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Operational & Ready
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-300 text-sm font-medium border border-blue-500/20">
                            <Box className="w-4 h-4" />
                            Version {info.version}
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-300 text-sm font-medium border border-purple-500/20">
                            <Globe className="w-4 h-4" />
                            Language: {info.lang.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500/10 text-pink-300 text-sm font-medium border border-pink-500/20">
                            <Zap className="w-4 h-4" />
                            {info.pipeline.length} Active Pipelines
                        </span>
                    </div>
                </div>
            </div>

            {/* Pipeline Architecture Showcase */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
                    <Layers className="w-4 h-4" />
                    Pipeline Architecture & Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {info.pipeline.map((component, i) => {
                        const details = PIPELINE_DESCRIPTIONS[component] || { role: "Custom Component", desc: "Specialized processing unit." };
                        return (
                            <div
                                key={i}
                                className="group relative p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex items-start gap-4"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-blue-500/20 transition-colors">
                                    <Zap className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-200 text-lg mb-1 group-hover:text-blue-300 transition-colors">
                                        {component}
                                    </h4>
                                    <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
                                        {details.role}
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        {details.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vector Information with Visuals */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2 mt-8">
                    <Database className="w-4 h-4" />
                    Vector Space & Embeddings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center hover:border-green-500/50 transition-all duration-500 hover:bg-zinc-800">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Database className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-4xl font-black text-zinc-100 group-hover:text-green-400 transition-colors mb-2 tracking-tight">
                            {info.vectors.vectors.toLocaleString()}
                        </div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Total Vectors
                        </div>
                    </div>

                    <div className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center hover:border-blue-500/50 transition-all duration-500 hover:bg-zinc-800">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Box className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-4xl font-black text-zinc-100 group-hover:text-blue-400 transition-colors mb-2 tracking-tight">
                            {info.vectors.width}
                        </div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Dimensions (Width)
                        </div>
                    </div>

                    <div className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center hover:border-purple-500/50 transition-all duration-500 hover:bg-zinc-800">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Key className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="text-4xl font-black text-zinc-100 group-hover:text-purple-400 transition-colors mb-2 tracking-tight">
                            {info.vectors.keys.toLocaleString()}
                        </div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Unique Keys
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
