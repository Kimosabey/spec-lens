import sys
import json
import spacy
from spacy import displacy
from custom_ner import SystemEntityRecognizer
from capability_extractor import CapabilityExtractor
from constraint_extractor import ConstraintExtractor

# Entity label descriptions
ENTITY_DESCRIPTIONS = {
    "PERSON": "People, including fictional",
    "NORP": "Nationalities, religious, political groups",
    "FAC": "Buildings, airports, highways, bridges",
    "ORG": "Companies, agencies, institutions",
    "GPE": "Countries, cities, states",
    "LOC": "Non-GPE locations, mountain ranges, water bodies",
    "PRODUCT": "Objects, vehicles, foods, etc.",
    "EVENT": "Named hurricanes, battles, wars, sports events",
    "WORK_OF_ART": "Titles of books, songs, etc.",
    "LAW": "Named documents made into laws",
    "LANGUAGE": "Any named language",
    "DATE": "Absolute or relative dates or periods",
    "TIME": "Times smaller than a day",
    "PERCENT": "Percentage",
    "MONEY": "Monetary values",
    "QUANTITY": "Measurements as of weight or distance",
    "ORDINAL": "First, second, etc.",
    "CARDINAL": "Numerals that do not fall under another type",
}

def get_model_info(nlp):
    """Extract model information."""
    meta = nlp.meta
    return {
        "name": meta.get("name", "unknown"),
        "lang": meta.get("lang", "en"),
        "version": meta.get("version", "0.0.0"),
        "description": meta.get("description", ""),
        "pipeline": list(nlp.pipe_names),
        "vectors": {
            "width": nlp.vocab.vectors.shape[1] if nlp.vocab.vectors.shape else 0,
            "vectors": nlp.vocab.vectors.shape[0] if nlp.vocab.vectors.shape else 0,
            "keys": len(nlp.vocab.vectors.keys()),
        }
    }

def get_tokens(doc):
    """Extract token information."""
    tokens = []
    for token in doc:
        tokens.append({
            "text": token.text,
            "lemma": token.lemma_,
            "pos": token.pos_,
            "tag": token.tag_,
            "dep": token.dep_,
            "head": token.head.text,
            "is_stop": token.is_stop,
            "is_alpha": token.is_alpha,
            "is_punct": token.is_punct,
            "shape": token.shape_,
            "ent_type": token.ent_type_,
            "idx": token.idx,
        })
    return tokens

def get_entities(doc):
    """Extract named entities."""
    entities = []
    for ent in doc.ents:
        entities.append({
            "text": ent.text,
            "label": ent.label_,
            "start": ent.start_char,
            "end": ent.end_char,
            "description": ENTITY_DESCRIPTIONS.get(ent.label_, "Unknown entity type"),
        })
    return entities

def get_dependencies(doc):
    """Extract dependency relations."""
    deps = []
    for token in doc:
        deps.append({
            "token": token.text,
            "dep": token.dep_,
            "head": token.head.text,
            "children": [child.text for child in token.children],
        })
    return deps

def get_sentences(doc):
    """Extract sentences."""
    sentences = []
    for sent in doc.sents:
        sentences.append({
            "text": sent.text.strip(),
            "start": sent.start_char,
            "end": sent.end_char,
            "root": sent.root.text,
        })
    return sentences

def get_properties(doc):
    """Extract properties/attributes (Adjective-Noun pairs)."""
    properties = {}
    for token in doc:
        if token.pos_ == "ADJ" and token.head.pos_ in ["NOUN", "PROPN"]:
            noun = token.head.text
            adj = token.text
            if noun not in properties:
                properties[noun] = []
            properties[noun].append(adj)
        # Also handle "The car is red" (attr)
        if token.dep_ == "attr" and token.head.pos_ == "VERB":
            subject = [child for child in token.head.children if child.dep_ == "nsubj"]
            if subject:
                subj_text = subject[0].text
                attr_text = token.text
                if subj_text not in properties:
                    properties[subj_text] = []
                properties[subj_text].append(attr_text)
                
    return properties

def get_stats(doc):
    """Calculate text statistics."""
    words = [token for token in doc if token.is_alpha]
    sentences = list(doc.sents)
    stop_words = [token for token in doc if token.is_stop]
    punctuation = [token for token in doc if token.is_punct]
    
    return {
        "char_count": len(doc.text),
        "word_count": len(words),
        "sentence_count": len(sentences),
        "token_count": len(doc),
        "unique_tokens": len(set([token.text.lower() for token in doc])),
        "avg_word_length": sum(len(w.text) for w in words) / len(words) if words else 0,
        "avg_sentence_length": len(words) / len(sentences) if sentences else 0,
        "stop_word_count": len(stop_words),
        "punctuation_count": len(punctuation),
    }

def get_vector_similarities(doc, nlp):
    """Calculate word vector similarities for content words."""
    similarities = []
    content_words = [token for token in doc if token.is_alpha and not token.is_stop and token.has_vector]
    
    # Get top unique words
    seen = set()
    unique_words = []
    for token in content_words:
        if token.text.lower() not in seen and len(unique_words) < 5:
            seen.add(token.text.lower())
            unique_words.append(token)
    
    # Calculate pairwise similarities
    for i, word1 in enumerate(unique_words):
        for word2 in unique_words[i+1:]:
            if word1.has_vector and word2.has_vector:
                sim = word1.similarity(word2)
                similarities.append({
                    "word1": word1.text,
                    "word2": word2.text,
                    "similarity": round(sim, 4),
                })
    
    return similarities

def get_lemmas(doc):
    """Get lemmatization data."""
    lemmas = []
    seen = set()
    for token in doc:
        if token.is_alpha and token.text.lower() not in seen:
            seen.add(token.text.lower())
            lemmas.append({
                "original": token.text,
                "lemma": token.lemma_,
            })
    return lemmas

def get_stop_and_content_words(doc):
    """Separate stop words and content words."""
    stop_words = list(set([token.text.lower() for token in doc if token.is_stop]))
    content_words = list(set([token.text.lower() for token in doc if token.is_alpha and not token.is_stop]))
    return stop_words, content_words

def main():
    try:
        # Read input
        input_data = sys.stdin.read()
        if not input_data:
            return

        input_json = json.loads(input_data)
        text = input_json.get("text", "")
        lang = input_json.get("language", "en")

        # Select model based on language
        model_name = "en_core_web_lg"
        if lang == "fr":
            model_name = "fr_core_news_lg"
        elif lang == "de":
            model_name = "de_core_news_lg"
        
        # Load spaCy model
        try:
            nlp = spacy.load(model_name)
        except OSError:
            # Fallback for dev/testing if model missing
            sys.stderr.write(f"Warning: Model {model_name} not found. Falling back to en_core_web_lg.\n")
            nlp = spacy.load("en_core_web_lg")
        
        
        # Add custom components
        if "custom_ner" not in nlp.pipe_names:
            nlp.add_pipe("custom_ner", last=True)
        if "capability_extractor" not in nlp.pipe_names:
            nlp.add_pipe("capability_extractor", last=True)
        if "constraint_extractor" not in nlp.pipe_names:
            nlp.add_pipe("constraint_extractor", last=True)

        # Process text
        doc = nlp(text)
        
        # Get stop and content words
        stop_words, content_words = get_stop_and_content_words(doc)

        # Construct full result
        result = {
            # Core analysis
            "entity": doc._.primary_entity if doc.has_extension("primary_entity") else "Unknown",
            "capabilities": doc._.capabilities if doc.has_extension("capabilities") else [],
            "properties": get_properties(doc), 
            "constraints": doc._.constraints if doc.has_extension("constraints") else [],
            "raw_sentences": [sent.text.strip() for sent in doc.sents],
            
            # Extended NLP data
            "tokens": get_tokens(doc),
            "entities": get_entities(doc),
            "dependencies": get_dependencies(doc),
            "sentences": get_sentences(doc),
            "stats": get_stats(doc),
            "model_info": get_model_info(nlp),
            "vector_similarities": get_vector_similarities(doc, nlp),
            "lemmas": get_lemmas(doc),
            "stop_words": stop_words,
            "content_words": content_words,
        }
        
        print(json.dumps(result))

    except Exception as e:
        error_result = {
            "entity": "Error",
            "capabilities": [],
            "properties": {},
            "constraints": [],
            "raw_sentences": [],
            "tokens": [],
            "entities": [],
            "dependencies": [],
            "sentences": [],
            "stats": {
                "char_count": 0, "word_count": 0, "sentence_count": 0,
                "token_count": 0, "unique_tokens": 0, "avg_word_length": 0,
                "avg_sentence_length": 0, "stop_word_count": 0, "punctuation_count": 0
            },
            "model_info": {"name": "", "lang": "", "version": "", "description": "", "pipeline": [], "vectors": {"width": 0, "vectors": 0, "keys": 0}},
            "vector_similarities": [],
            "lemmas": [],
            "stop_words": [],
            "content_words": [],
            "error": str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
