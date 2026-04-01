import React, { useState } from 'react';
import { Home, History, Stethoscope, FilePlus } from 'lucide-react';
import axios from 'axios';
import Recorder from './components/Recorder';
import Transcript from './components/Transcript';
import OPDDocument from './components/OPDDocument';
import PatientList from './components/PatientList';

export default function App() {
  const [currentView, setCurrentView] = useState('record'); // record, review, history
  const [transcriptData, setTranscriptData] = useState(null);
  const [opdDocument, setOpdDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTranscribeComplete = (data) => {
    setTranscriptData(data);
  };

  const handleGenerateDoc = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post("http://localhost:8000/api/generate-document", {
        transcript: transcriptData.transcript,
        entities: transcriptData.entities,
        language_detected: transcriptData.language
      });
      setOpdDocument(response.data.document);
      setCurrentView('review');
    } catch(err) {
      console.error(err);
      alert("Error generating document");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDoc = async (docData) => {
    try {
      if(transcriptData) {
        docData.raw_transcript = transcriptData.transcript;
        docData.language_detected = transcriptData.language;
      }
      
      const sanitizedData = {};
      for (const key in docData) {
        if (docData[key] !== null && docData[key] !== undefined) {
          sanitizedData[key] = typeof docData[key] === 'object' ? JSON.stringify(docData[key]) : String(docData[key]);
        }
      }
      
      if (docData.id) {
        await axios.put(`http://localhost:8000/api/documents/${docData.id}`, sanitizedData);
        alert("Document updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/documents", sanitizedData);
        alert("Document saved successfully!");
      }
      
      setCurrentView('history');
      setTranscriptData(null);
      setOpdDocument(null);
    } catch(err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'object' ? JSON.stringify(detail) : (detail || err.message);
      alert("Failed to save document. " + errorMsg);
    }
  };
  
  const handleViewDocument = (doc) => {
    setOpdDocument(doc);
    setCurrentView('review');
  };

  const resetToNew = () => {
    setTranscriptData(null);
    setOpdDocument(null);
    setCurrentView('record');
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section" style={{ padding: '2rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <Stethoscope size={32} />
          <span style={{ fontSize: '1.4rem' }}>LinguaOPD</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem', padding: '0 0.5rem' }}>
          <button 
            className={`nav-item ${currentView !== 'history' ? 'active' : ''}`}
            onClick={resetToNew}
            style={{ justifyContent: 'flex-start', width: '100%', padding: '1rem' }}
          >
            <FilePlus size={20} /> New Consultation
          </button>
          <button 
            className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
            style={{ justifyContent: 'flex-start', width: '100%', padding: '1rem' }}
          >
            <History size={20} /> Patient Records
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--text-main)', fontSize: '2.2rem' }}>
            {currentView === 'history' ? 'History & Records' : 'Active Consultation'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            {currentView === 'history' ? 'View and manage previous OPD documents.' : 'AI-assisted multilingual transcription and documentation system.'}
          </p>
        </header>

        {currentView === 'record' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Recorder onTranscribeComplete={handleTranscribeComplete} />
            
            {transcriptData && (
              <Transcript 
                data={transcriptData} 
                onGenerateDoc={handleGenerateDoc} 
              />
            )}
            
            {isGenerating && (
              <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--primary)' }}>
                  <Stethoscope className="animate-spin" style={{ animationDuration: '3s' }} /> 
                  Generating standardized medical document with Gemini...
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === 'review' && opdDocument && (
          <OPDDocument 
            document={opdDocument} 
            onSave={handleSaveDoc} 
            onBack={() => {
              if (opdDocument.id) {
                setCurrentView('history');
                setOpdDocument(null);
              } else {
                setCurrentView('record');
              }
            }}
          />
        )}

        {currentView === 'history' && (
          <PatientList onView={handleViewDocument} />
        )}
      </div>
    </div>
  );
}
