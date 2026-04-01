from googletrans import Translator

translator = Translator()

def translate_to_english(text: str, source_lang: str) -> str:
    if not text.strip():
        return text
    base_lang = source_lang.lower()
    if base_lang.startswith("en"):
        return text
    
    try:
        result = translator.translate(text, dest='en')
        return result.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text
