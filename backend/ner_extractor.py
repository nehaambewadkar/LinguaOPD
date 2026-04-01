import spacy
import sys

# Try loading the scispacy model
try:
    nlp = spacy.load("en_core_sci_sm")
except OSError:
    print("en_core_sci_sm model not found. Proceeding with en_core_web_sm as fallback or empty entities.", file=sys.stderr)
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        nlp = None

def extract_medical_entities(text: str) -> dict:
    if not nlp:
        return {"entities": []}
        
    doc = nlp(text)
    entities = []
    
    # Simple extraction of recognized scientific/medical entities
    for ent in doc.ents:
        if ent.text.lower() not in [e.lower() for e in entities]:
            entities.append(ent.text)
            
    return {"entities": entities}
