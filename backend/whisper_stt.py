import google.generativeai as genai
import os
import json
import time
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY and API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=API_KEY)

def transcribe_audio(file_path: str) -> dict:
    if not os.path.exists(file_path):
        raise FileNotFoundError("Audio file not found")
        
    if not API_KEY or API_KEY == "your_gemini_api_key_here":
        # Mock behavior for testing if no key provided
        return {
            "text": "This is a mock transcription because no Gemini API key was provided. I am testing the system. Main 3 din se bimar hu.",
            "language": "en"
        }
    
    print("Uploading audio to Gemini for STT and translation...")
    
    # Gemini 1.5 Flash supports audio inherently, but we must explicitly tell it the mime_type
    # Otherwise Windows will guess 'video/webm' and cause server processing to fail.
    audio_file = genai.upload_file(path=file_path, mime_type="audio/webm")
    
    # Wait for the file to be processed by Gemini backend
    print("Waiting for file to be ready...")
    while audio_file.state.name == "PROCESSING":
        time.sleep(2)
        audio_file = genai.get_file(audio_file.name)
        
    if audio_file.state.name == "FAILED":
        raise Exception("Audio file processing failed on Gemini servers.")
    
    prompt = """
    Listen to this medical consultation audio carefully. 
    1. Identify the primary language spoken.
    2. Transcribe exactly what is being said (in the original source language).
    Return your output strictly as a JSON object with exactly two string keys: "language" (e.g., "hi", "en", "ml"), and "transcript" (the native text). 
    Do not add extra formatting or markdown blocks, just raw valid JSON.
    """
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content([prompt, audio_file])
    
    try:
        genai.delete_file(audio_file.name) # cleanup
    except:
        pass
    
    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:-3]
    elif text.startswith("```"):
        text = text[3:-3]
        
    try:
        data = json.loads(text.strip())
        return {
            "text": data.get("transcript", ""),
            "language": data.get("language", "unknown").lower()
        }
    except Exception as e:
        print("Failed to parse Gemini transcription JSON:", e)
        return {
            "text": "Transcription parse error. Raw output: " + text,
            "language": "unknown"
        }
