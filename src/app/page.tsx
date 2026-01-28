"use client";

import { useState } from "react";
import { analyzeText } from "../actions/analyzeText";
import { AnalysisResult } from "../types/data-contract";
import { KnowledgeGraph } from "../components/KnowledgeGraph";
import {
  TokenExplorer,
  TextStats,
  NamedEntities,
  PartOfSpeech,
  Dependencies,
  Lemmatization,
  WordVectors,
  Sentences,
  StopWords,
  ModelInfo,
} from "../components/nlp";
import { InfoButton } from "../components/ui/Tooltip";
import NeuralBackground from "../components/ui/NeuralBackground";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowLeft, ChevronDown, FileText } from "lucide-react";

type TabCategory = "analysis" | "entities" | "advanced" | "processing" | "info";
type Tab = {
  id: string;
  label: string;
  category: TabCategory;
};

const TABS: Tab[] = [
  { id: "full-analysis", label: "Full Analysis", category: "analysis" },
  { id: "token-explorer", label: "Token Explorer", category: "analysis" },
  { id: "text-stats", label: "Text Stats", category: "analysis" },
  { id: "named-entities", label: "Named Entities", category: "entities" },
  { id: "part-of-speech", label: "Part of Speech", category: "entities" },
  { id: "dependencies", label: "Dependencies", category: "entities" },
  // { id: "knowledge-graph", label: "Knowledge Graph", category: "advanced" },
  { id: "word-vectors", label: "Word Vectors", category: "advanced" },
  { id: "lemmatization", label: "Lemmatization", category: "processing" },
  { id: "sentences", label: "Sentences", category: "processing" },
  { id: "stop-words", label: "Stop Words", category: "processing" },
  { id: "model-info", label: "Model Info", category: "info" },
];

const CATEGORY_LABELS: Record<TabCategory, string> = {
  analysis: "ANALYSIS",
  entities: "ENTITIES & GRAMMAR",
  advanced: "ADVANCED",
  processing: "TEXT PROCESSING",
  info: "INFO",
};

export default function Home() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "fr" | "de">("en");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("full-analysis");
  const [highlightedSentence, setHighlightedSentence] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeText({ text: input, language });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!result) return null;

    switch (activeTab) {
      case "full-analysis":
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/60 cursor-pointer">
              <h3 className="font-semibold text-blue-300">
                Primary Entity: <span className="text-blue-400 text-lg">{result.entity}</span>
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/60 cursor-pointer">
                <h4 className="font-semibold text-green-400 mb-2">
                  Capabilities ({result.capabilities.length})
                </h4>
                {result.capabilities.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No capabilities found</p>
                ) : (
                  result.capabilities.map((cap, i) => (
                    <div key={i} className="text-sm text-green-300 py-1">
                      • {cap.action} {cap.target}
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 hover:border-red-500/60 cursor-pointer">
                <h4 className="font-semibold text-red-400 mb-2">
                  Constraints ({result.constraints.length})
                </h4>
                {result.constraints.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No constraints found</p>
                ) : (
                  result.constraints.map((con, i) => (
                    <div key={i} className="text-sm text-red-300 py-1">
                      • [{con.type}] {con.requirement}
                    </div>
                  ))
                )}
              </div>

              {/* Properties / Attributes Section - New */}
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 md:col-span-2 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/60 cursor-pointer">
                <h4 className="font-semibold text-purple-400 mb-2">
                  Extracted Properties & Attributes
                </h4>
                {Object.keys(result.properties).length === 0 ? (
                  <p className="text-zinc-500 text-sm">No specific properties detected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.properties).map(([subject, attrs]) => (
                      <div key={subject} className="px-3 py-1.5 rounded bg-purple-500/20 border border-purple-500/30 text-sm">
                        <span className="text-purple-200 font-medium">{subject}</span>
                        <span className="text-purple-400 mx-1">:</span>
                        <span className="text-purple-300">{attrs.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <TextStats stats={result.stats} />
          </div>
        );
      case "token-explorer":
        return <TokenExplorer tokens={result.tokens} />;
      case "text-stats":
        return <TextStats stats={result.stats} />;
      case "named-entities":
        return <NamedEntities entities={result.entities} text={input} />;
      case "part-of-speech":
        return <PartOfSpeech tokens={result.tokens} />;
      case "dependencies":
        return <Dependencies dependencies={result.dependencies} />;
      case "knowledge-graph":
        return (
          <div className="h-[400px] sm:h-[500px]">
            <KnowledgeGraph
              data={result}
              onNodeClick={(sentence) => setHighlightedSentence(sentence)}
            />
          </div>
        );
      case "word-vectors":
        return <WordVectors similarities={result.vector_similarities} />;
      case "lemmatization":
        return <Lemmatization lemmas={result.lemmas} />;
      case "sentences":
        return <Sentences sentences={result.sentences} />;
      case "stop-words":
        return <StopWords stopWords={result.stop_words} contentWords={result.content_words} />;
      case "model-info":
        return <ModelInfo info={result.model_info} />;
      default:
        return null;
    }
  };

  // Group tabs by category
  const tabsByCategory = TABS.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = [];
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<TabCategory, Tab[]>);

  const currentTabLabel = TABS.find((t) => t.id === activeTab)?.label || "Select";

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100 font-sans relative pb-48 transition-colors duration-300">
      <NeuralBackground />

      {/* Header - Fixed Floating Glassmorphism */}
      <header className="fixed top-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-0 lg:right-0 max-w-7xl mx-auto z-50 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl dark:shadow-2xl transition-all duration-300">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-500" />
              SpecLens <span className="text-blue-600 dark:text-blue-500">V1</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block tracking-wide opacity-80">
              INTELLIGENT SPECIFICATION ANALYSIS
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex bg-white/20 dark:bg-black/40 rounded-lg p-1 border border-zinc-200 dark:border-white/5 transition-colors">
              {[
                { code: "en", label: "🇬🇧 EN" },
                { code: "fr", label: "🇫🇷 FR" },
                { code: "de", label: "🇩🇪 DE" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as "en" | "fr" | "de")}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium transition-all",
                    language === lang.code
                      ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-500/30"
                      : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/20 dark:bg-black/40 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400 shadow-inner hidden sm:inline-block">
              {loading ? "Processing..." : result ? "✓ READY" : "WAITING"}
            </span>

          </div>
        </div>
      </header>

      {/* Main Content - Added top padding for header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8 transition-colors duration-500">
        {/* Input Section - Responsive */}
        {!result && (
          <div className="space-y-4 mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-white/60 transition-all">Analyze Your Text</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed transition-colors">
                Extract hidden insights, entities, and requirements from technical documents using advanced NLP
              </p>
            </div>
            <textarea
              className="w-full h-32 sm:h-48 p-5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-600 transition-all hover:bg-white/80 dark:hover:bg-black/50 shadow-xl dark:shadow-2xl"
              placeholder="Example: Apple Inc. was founded by Steve Jobs in 1976. The company must ensure user privacy. iPhone supports Face ID authentication."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className={cn(
                "w-full py-4 px-6 rounded-xl font-bold text-white transition-all text-base sm:text-lg flex items-center justify-center gap-2 mt-4 group relative overflow-hidden",
                loading || !input.trim()
                  ? "bg-zinc-200 dark:bg-zinc-800 cursor-not-allowed text-zinc-400 dark:text-zinc-500"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/20 active:scale-[0.99]"
              )}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Analyze Text
                </>
              )}
            </button>
            {error && (
              <p className="text-red-500 dark:text-red-400 text-center py-3 bg-red-100/50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Results Section - Responsive */}
        {result && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 pt-4">
            {/* Back Button */}
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Analyze New Text
            </button>

            {/* Mobile Tab Selector */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 backdrop-blur-md"
              >
                <span className="font-medium">{currentTabLabel}</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform", mobileMenuOpen && "rotate-180")} />
              </button>
              {mobileMenuOpen && (
                <div className="mt-2 p-2 rounded-xl bg-zinc-800/90 border border-zinc-700 max-h-[60vh] overflow-y-auto backdrop-blur-md shadow-2xl relative z-50">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all",
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-zinc-300 hover:bg-zinc-700"
                      )}
                    >
                      <span>{tab.label}</span>
                      <InfoButton tabId={tab.id} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden sm:block bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/10 p-1 shadow-xl dark:shadow-2xl transition-all">
              <div className="flex flex-wrap gap-1 p-1">
                {(Object.keys(tabsByCategory) as TabCategory[]).map((category) => (
                  <div key={category} className="flex items-center gap-1 flex-wrap p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 mb-2 last:mb-0 mr-2 last:mr-0 transition-colors">
                    <span className="text-[9px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-bold w-full mb-1 pl-1">
                      {CATEGORY_LABELS[category]}
                    </span>
                    {tabsByCategory[category].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent",
                          activeTab === tab.id
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-blue-500/50"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10"
                        )}
                      >
                        {tab.label}
                        <InfoButton tabId={tab.id} />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/10 p-4 sm:p-8 overflow-x-auto shadow-xl dark:shadow-2xl min-h-[400px] transition-colors">
              {renderTabContent()}
            </div>

            {/* Source Text */}
            <details className="bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-white/5 group transition-colors">
              <summary className="p-4 cursor-pointer text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-2 transition-colors text-sm font-medium select-none">
                <FileText className="w-4 h-4" />
                View Source Text
                <ChevronDown className="w-4 h-4 ml-auto group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 pt-0 border-t border-zinc-100 dark:border-white/5">
                <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-mono">{input}</p>
              </div>
            </details>
          </div>
        )}
      </main>

      {/* Footer - Fixed Glassmorphism */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl pb-6 pt-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
            <span>Built with Next.js 16 + spaCy</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <a href="/setup.md" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Setup Guide</a>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-blue-500/30 transition-colors duration-300 group cursor-default">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors">Designed by</span>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Harshan Aiyappa
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
