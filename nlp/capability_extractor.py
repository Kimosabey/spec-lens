import spacy
from spacy.language import Language
from spacy.matcher import DependencyMatcher
from spacy.tokens import Doc

@Language.factory("capability_extractor")
class CapabilityExtractor:
    def __init__(self, nlp: Language, name: str):
        self.nlp = nlp
        self.matcher = DependencyMatcher(nlp.vocab)
        
        # Define patterns
        
        # 1. Active Voice: Subject (System) -> Verb -> Object (Capability)
        # e.g., "System X supports high-frequency trading."
        self.matcher.add("SVO_CAPABILITY", [[
            {
                "RIGHT_ID": "verb",
                "RIGHT_ATTRS": {"POS": "VERB"}
            },
            {
                "LEFT_ID": "verb",
                "REL_OP": ">",
                "RIGHT_ID": "subject",
                "RIGHT_ATTRS": {"DEP": "nsubj"}
            },
            {
                "LEFT_ID": "verb",
                "REL_OP": ">",
                "RIGHT_ID": "object",
                "RIGHT_ATTRS": {"DEP": {"IN": ["dobj", "attr", "prep"]}} 
            }
        ]])
        
        # 2. Passive Voice: Subject (Capability) -> Verb -> Agent (System)
        # e.g., "High-frequency trading is supported by System X."
        self.matcher.add("PASSIVE_CAPABILITY", [[
            {
                "RIGHT_ID": "verb",
                "RIGHT_ATTRS": {"POS": "VERB"}
            },
            {
                "LEFT_ID": "verb",
                "REL_OP": ">",
                "RIGHT_ID": "subject", # The capability in passive
                "RIGHT_ATTRS": {"DEP": "nsubjpass"}
            },
            {
                "LEFT_ID": "verb",
                "REL_OP": ">",
                "RIGHT_ID": "agent_prep",
                "RIGHT_ATTRS": {"LOWER": "by"}
            },
            {
                "LEFT_ID": "agent_prep",
                "REL_OP": ">",
                "RIGHT_ID": "agent", # The system
                "RIGHT_ATTRS": {"DEP": "pobj"}
            }
        ]])

    def __call__(self, doc: Doc) -> Doc:
        if not Doc.has_extension("capabilities"):
            Doc.set_extension("capabilities", default=[])
            
        matches = self.matcher(doc)
        capabilities = []
        
        for match_id, token_ids in matches:
            pattern_name = self.nlp.vocab.strings[match_id]
            
            if pattern_name == "SVO_CAPABILITY":
                # verb = doc[token_ids[0]]
                # subject = doc[token_ids[1]]
                obj = doc[token_ids[2]]
                
                # Get the full subtree of the object to capture the full capability description
                capability_text = "".join([t.text_with_ws for t in obj.subtree]).strip()
                
                capabilities.append({
                    "action": doc[token_ids[0]].lemma_,
                    "target": capability_text,
                    "confidence": 0.9, # Rule-based is high confidence
                    "source_sentence": obj.sent.text
                })
                
            elif pattern_name == "PASSIVE_CAPABILITY":
                # verb = doc[token_ids[0]]
                subject = doc[token_ids[1]]
                # agent = doc[token_ids[3]]
                
                capability_text = "".join([t.text_with_ws for t in subject.subtree]).strip()
                
                capabilities.append({
                    "action": doc[token_ids[0]].lemma_,
                    "target": capability_text,
                    "confidence": 0.85,
                    "source_sentence": subject.sent.text
                })
                
        doc._.capabilities = capabilities
        return doc
