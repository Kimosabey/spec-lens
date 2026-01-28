import spacy
from spacy.language import Language
from spacy.tokens import Doc

@Language.factory("constraint_extractor")
class ConstraintExtractor:
    def __init__(self, nlp: Language, name: str):
        self.nlp = nlp
        self.mandatory_lemmas = ["must", "shall", "require", "need"]
        self.conditional_lemmas = ["if", "when", "unless"]

    def __call__(self, doc: Doc) -> Doc:
        if not Doc.has_extension("constraints"):
            Doc.set_extension("constraints", default=[])
            
        constraints = []
        
        for sent in doc.sents:
            # Check for mandatory keywords
            has_mandatory = any(token.lemma_ in self.mandatory_lemmas for token in sent)
            
            if has_mandatory:
                # Determine type
                constraint_type = "Mandatory"
                if any(token.lemma_ in self.conditional_lemmas for token in sent):
                    constraint_type = "Conditional"
                
                constraints.append({
                    "requirement": sent.text.strip(),
                    "type": constraint_type
                })
                
        doc._.constraints = constraints
        return doc
