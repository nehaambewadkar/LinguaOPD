# LinguaOPD: AI-Assisted Multilingual OPD Documentation System

**LinguaOPD** is a state-of-the-art medical documentation assistant designed to streamline the Outpatient Department (OPD) consultation process. By leveraging advanced AI and multilingual support, it captures doctor-patient conversations, transcribes them, and automatically generates standardized, professional medical documents.
Simplifies OPD consultations by capturing and transcribing doctor-patient conversations with multilingual support.

---

## 🚀 Key Features

- **Multilingual Consultation**: Conduct consultations in multiple languages with automatic translation and English standardization.
- **AI-Powered Extraction**: Uses **Google Gemini** and **SciSpacy** to intelligently extract medical entities like Symptoms, Diagnoses, and Prescriptions.
- **Real-time Documentation**: Automatically generates structured OPD notes including Chief Complaint, History, Examination, Diagnosis, and Advice.
- **Secure Records**: Persistent storage of patient history with full **Update/Edit** capabilities.
- **One-Click Printing**: Premium, print-ready document layouts for immediate physical records.
- **Premium UI/UX**: Modern, responsive interface with a focus on medical professionals' workflow.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React.js (Vite)
- **Icons**: Lucide React
- **API Client**: Axios
- **Styling**: Modern Vanilla CSS (Custom UI Components)
- **Audio**: Web Audio API for browser-based recording

### **Backend**
- **API Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy (Async)
- **Generative AI**: Google Gemini API (`gemini-1.5-flash`)
- **Speech-to-Text**: Whisper STT
- **Medical NLP**: SciSpacy (Specialized Medical Entity Recognition)
- **Translation**: GoogleTrans (Multilingual Support)
- **Asynchronous Server**: Uvicorn

---

## 📂 Project Structure

```text
OPD_Project/
├── backend/            # FastAPI Backend
│   ├── main.py         # API Endpoints & FastAPI App
│   ├── models.py       # Pydantic Schemas
│   ├── crud.py         # Database Operations (SQLAlchemy)
│   ├── doc_generator.py# Gemini AI Integration
│   ├── whisper_stt.py  # Speech-to-Text Module
│   └── .env            # Environment Configuration (API Keys)
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # UI Components (Recorder, OPDDocument, PatientList)
│   │   ├── App.jsx     # Main Application Logic
│   │   └── index.css   # Global Premium Styles
│   └── package.json    # Frontend Dependencies
└── runapp.py           # Unified Runner Script
```

---

## ⚙️ Installation & Setup

### **1. Prerequisites**
- Python 3.8+
- Node.js (v18+)
- Google Gemini API Key

### **2. Backend Setup**
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_sci_sm
```
Create a `.env` file in the `backend` folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### **3. Frontend Setup**
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

---

## 🏃 Running the Application

For convenience, you can launch both the frontend and backend using the root runner script:

```bash
python runapp.py
```
*Alternatively:*
- **Backend**: `uvicorn main:app --reload` (inside `backend` folder)
- **Frontend**: `npm run dev` (inside `frontend` folder)

---

## 🏥 Usage Guide
1. **New Consultation**: Click "New Consultation" and hit the **Record** button. Speak naturally during the patient visit.
2. **Review**: Once transcription is complete, the AI will generate a structured draft. Review and edit any fields (Name, Diagnosis, etc.).
3. **Save/Print**: Click "**Save Record**" to store it permanently. You can also **Print** the document for the patient.
4. **History**: Go to "**Patient Records**" to search, view, or update any previous consultations.

---

## 📜 License
This project is developed for medical efficiency and clinical documentation assistance. (Custom license details here).
