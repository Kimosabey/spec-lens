import spacy
from spacy.language import Language
from spacy.tokens import Doc, Span

@Language.factory("custom_ner")
class SystemEntityRecognizer:
    def __init__(self, nlp: Language, name: str):
        self.nlp = nlp
        # In a real scenario, this might be dynamic or passed in config
        # For V1, we'll look for common patterns like "System X", "Device Y", or capitalized noun phrases
        self.target_labels = ["SYSTEM", "COMPONENT"]

    def __call__(self, doc: Doc) -> Doc:
        # Simple rule-based extraction for the "Main Subject"
        # We'll assume the most frequent proper noun or specific patterns denote the entity
        
        # 1. Look for explicit patterns (e.g., "The System", "Device")
        # This is a placeholder for more complex logic
        
        # For V1 Scope: Let's just try to find the first PROPN that looks like a system name
        # or use the first Noun Chunk that acts as a subject.
        
        # Let's store the "primary entity" in a custom extension
        if not Doc.has_extension("primary_entity"):
            Doc.set_extension("primary_entity", default=None)
            
        candidates = []
        for token in doc:
            if token.pos_ == "PROPN":
                candidates.append(token.text)
        
        # Heuristic: Most frequent PROPN is likely the system name
        if candidates:
            most_common = max(set(candidates), key=candidates.count)
            doc._.primary_entity = most_common
        else:
            doc._.primary_entity = "Unknown System"
            
        return doc
