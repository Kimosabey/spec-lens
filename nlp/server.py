from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import spacy
import json
import sys
from pipeline import (
    get_properties, get_tokens, get_entities, get_dependencies, 
    get_sentences, get_stats, get_model_info, get_vector_similarities, 
    get_lemmas, get_stop_and_content_words
)

app = FastAPI()

# Input model
class AnalysisInput(BaseModel):
    text: str
    language: str = "en"

# Load models once on startup
models = {}

@app.on_event("startup")
def load_nlp_models():
    print("🚀 Loading NLP Models...")
    try:
        models["en"] = spacy.load("en_core_web_lg")
        # Add custom components
        for model in models.values():
            if "custom_ner" not in model.pipe_names:
                model.add_pipe("custom_ner", last=True)
            if "capability_extractor" not in model.pipe_names:
                model.add_pipe("capability_extractor", last=True)
            if "constraint_extractor" not in model.pipe_names:
                model.add_pipe("constraint_extractor", last=True)
        print("✅ Models Loaded")
    except Exception as e:
        print(f"❌ Error loading models: {e}")

@app.post("/analyze")
async def analyze(input_data: AnalysisInput):
    try:
        nlp = models.get(input_data.language, models["en"])
        doc = nlp(input_data.text)
        
        stop_words, content_words = get_stop_and_content_words(doc)

        result = {
            "entity": doc._.primary_entity if doc.has_extension("primary_entity") else "Unknown",
            "capabilities": doc._.capabilities if doc.has_extension("capabilities") else [],
            "properties": get_properties(doc), 
            "constraints": doc._.constraints if doc.has_extension("constraints") else [],
            "raw_sentences": [sent.text.strip() for sent in doc.sents],
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
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "models": list(models.keys())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
