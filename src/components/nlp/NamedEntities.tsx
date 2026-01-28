"use client";

import { Entity } from "@/types/data-contract";
import { Tag, User, Building, MapPin, Calendar, DollarSign, Package, Sparkles } from "lucide-react";

interface NamedEntitiesProps {
    entities: Entity[];
    text: string;
}

const ENTITY_ICONS: Record<string, React.ElementType> = {
    PERSON: User,
    ORG: Building,
    GPE: MapPin,
    LOC: MapPin,
    DATE: Calendar,
    TIME: Calendar,
    MONEY: DollarSign,
    PRODUCT: Package,
};

const ENTITY_COLORS: Record<string, string> = {
    PERSON: "from-pink-500/10 via-rose-500/10 to-transparent border-pink-500/30 text-pink-700 dark:text-pink-300",
    ORG: "from-blue-500/10 via-indigo-500/10 to-transparent border-blue-500/30 text-blue-700 dark:text-blue-300",
    GPE: "from-green-500/10 via-emerald-500/10 to-transparent border-green-500/30 text-green-700 dark:text-green-300",
    LOC: "from-emerald-500/10 via-teal-500/10 to-transparent border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
    DATE: "from-yellow-500/10 via-amber-500/10 to-transparent border-yellow-500/30 text-yellow-700 dark:text-yellow-300",
    TIME: "from-amber-500/10 via-orange-500/10 to-transparent border-amber-500/30 text-amber-700 dark:text-amber-300",
    MONEY: "from-lime-500/10 via-green-500/10 to-transparent border-lime-500/30 text-lime-700 dark:text-lime-300",
    PERCENT: "from-cyan-500/10 via-sky-500/10 to-transparent border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
    PRODUCT: "from-violet-500/10 via-purple-500/10 to-transparent border-violet-500/30 text-violet-700 dark:text-violet-300",
    EVENT: "from-rose-500/10 via-red-500/10 to-transparent border-rose-500/30 text-rose-700 dark:text-rose-300",
    FAC: "from-indigo-500/10 via-blue-500/10 to-transparent border-indigo-500/30 text-indigo-700 dark:text-indigo-300",
    NORP: "from-orange-500/10 via-amber-500/10 to-transparent border-orange-500/30 text-orange-700 dark:text-orange-300",
    LAW: "from-red-500/10 via-rose-500/10 to-transparent border-red-500/30 text-red-700 dark:text-red-300",
    LANGUAGE: "from-teal-500/10 via-cyan-500/10 to-transparent border-teal-500/30 text-teal-700 dark:text-teal-300",
    WORK_OF_ART: "from-fuchsia-500/10 via-pink-500/10 to-transparent border-fuchsia-500/30 text-fuchsia-700 dark:text-fuchsia-300",
    QUANTITY: "from-sky-500/10 via-blue-500/10 to-transparent border-sky-500/30 text-sky-700 dark:text-sky-300",
    ORDINAL: "from-purple-500/10 via-violet-500/10 to-transparent border-purple-500/30 text-purple-700 dark:text-purple-300",
    CARDINAL: "from-zinc-500/10 via-gray-500/10 to-transparent border-zinc-500/30 text-zinc-700 dark:text-zinc-300",
};

export function NamedEntities({ entities, text }: NamedEntitiesProps) {
    if (!entities.length) {
        return (
            <div className="text-zinc-500 text-center py-8 flex flex-col items-center gap-2">
                <Sparkles className="w-8 h-8 animate-pulse text-zinc-300 dark:text-zinc-600" />
                No named entities found
            </div>
        );
    }

    // Group entities by label
    const groupedEntities = entities.reduce((acc, ent) => {
        if (!acc[ent.label]) acc[ent.label] = [];
        acc[ent.label].push(ent);
        return acc;
    }, {} as Record<string, Entity[]>);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Entity Legend */}
            <div className="flex flex-wrap gap-2">
                {Object.keys(groupedEntities).map((label, i) => {
                    const Icon = ENTITY_ICONS[label] || Tag;
                    return (
                        <span
                            key={label}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r border ${ENTITY_COLORS[label] || "from-zinc-500/10 to-transparent border-zinc-500/30 text-zinc-700 dark:text-zinc-300"} transition-transform hover:scale-105 shadow-sm`}
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <Icon className="w-3 h-3" />
                            {label} ({groupedEntities[label].length})
                        </span>
                    );
                })}
            </div>

            {/* Entity List */}
            <div className="grid gap-3">
                {entities.map((entity, i) => {
                    const Icon = ENTITY_ICONS[entity.label] || Tag;
                    return (
                        <div
                            key={i}
                            className={`group p-4 rounded-xl bg-white dark:bg-black/20 bg-gradient-to-r border ${ENTITY_COLORS[entity.label] || "from-zinc-500/10 border-zinc-500/30"} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-5 h-5 opacity-80" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-lg text-zinc-800 dark:text-zinc-100">{entity.text}</span>
                                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400">
                                            {entity.label}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                                    {entity.start}-{entity.end}
                                </span>
                            </div>
                            <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400 pl-12">{entity.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
