export type Input = {
  text: string;
  language?: "en" | "fr" | "de";
};

// Token information
export type Token = {
  text: string;
  lemma: string;
  pos: string;
  tag: string;
  dep: string;
  head: string;
  is_stop: boolean;
  is_alpha: boolean;
  is_punct: boolean;
  shape: string;
  ent_type: string;
  idx: number;
};

// Named entity
export type Entity = {
  text: string;
  label: string;
  start: number;
  end: number;
  description: string;
};

// Dependency relation
export type Dependency = {
  token: string;
  dep: string;
  head: string;
  children: string[];
};

// Sentence
export type Sentence = {
  text: string;
  start: number;
  end: number;
  root: string;
};

// Text statistics
export type TextStats = {
  char_count: number;
  word_count: number;
  sentence_count: number;
  token_count: number;
  unique_tokens: number;
  avg_word_length: number;
  avg_sentence_length: number;
  stop_word_count: number;
  punctuation_count: number;
};

// Model information
export type ModelInfo = {
  name: string;
  lang: string;
  version: string;
  description: string;
  pipeline: string[];
  vectors: {
    width: number;
    vectors: number;
    keys: number;
  };
};

// Capability (existing)
export type Capability = {
  action: string;
  target: string;
  confidence: number;
  source_sentence: string;
};

// Constraint (existing)
export type Constraint = {
  requirement: string;
  type: "Mandatory" | "Conditional";
};

// Full analysis result
export type AnalysisResult = {
  // Core analysis
  entity: string;
  capabilities: Capability[];
  properties: Record<string, string[]>;
  constraints: Constraint[];
  raw_sentences: string[];

  // Extended NLP data
  tokens: Token[];
  entities: Entity[];
  dependencies: Dependency[];
  sentences: Sentence[];
  stats: TextStats;
  model_info: ModelInfo;

  // Word vectors (sample similarities)
  vector_similarities: {
    word1: string;
    word2: string;
    similarity: number;
  }[];

  // Lemmatization data
  lemmas: {
    original: string;
    lemma: string;
  }[];

  // Stop words
  stop_words: string[];
  content_words: string[];
};
