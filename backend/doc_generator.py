import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY and API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=API_KEY)

prompt_template = """
You are a highly capable Medical Secretary. You will be provided with a patient's transcript.
Your task is to structure the information into a formal OPD Document with the following exact keys in a valid JSON format.
If information is missing, use "Not provided". Do NOT add extra keys.
All values MUST be strings. Do not use arrays or nested objects as values (e.g. join arrays with commas).

Here are the keys:
- patient_name
- age
- gender
- date (use today's date if not mentioned: {today})
- chief_complaint
- history
- examination
- diagnosis
- prescription
- advice
- follow_up

Transcript Text: {transcript}
Extracted Medical Entities for reference: {entities}

Output strictly only valid JSON.
"""

def generate_opd_document(transcript: str, entities: list) -> dict:
    if not API_KEY or API_KEY == "your_gemini_api_key_here":
        return {
            "patient_name": "Mock Patient",
            "age": "30",
            "gender": "Unknown",
            "date": datetime.today().strftime('%Y-%m-%d'),
            "chief_complaint": transcript[:50],
            "history": "Mock history",
            "examination": "Mock Examination",
            "diagnosis": "Mock Diagnosis",
            "prescription": "Mock Prescription",
            "advice": "Extracted entities: " + ", ".join(entities),
            "follow_up": "In 5 days"
        }
        
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content(
        prompt_template.format(
            transcript=transcript, 
            entities=entities, 
            today=datetime.today().strftime('%Y-%m-%d')
        )
    )
    
    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:-3]
    elif text.startswith("```"):
        text = text[3:-3]
        
    try:
        return json.loads(text.strip())
    except:
        return {
            "chief_complaint": "Failed to parse JSON from LLM.",
            "raw_text": text
        }
