import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Recorder({ onTranscribeComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'record.webm');

        try {
          const response = await axios.post('http://localhost:8000/api/transcribe', formData);
          onTranscribeComplete(response.data);
        } catch (error) {
          console.error("Transcription error:", error);
          alert("Error transcribing audio. Make sure backend is running.");
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to record.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Record Consultation</h2>
      
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
          <Loader2 className="animate-spin" size={64} color="var(--primary)" style={{ animation: 'spin 2s linear infinite' }} />
          <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>Transcribing & Extracting Medical Context...</p>
        </div>
      ) : (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: isRecording ? '#ef4444' : 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isRecording ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 10px 25px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isRecording ? <Square size={48} fill="currentColor" /> : <Mic size={56} />}
        </button>
      )}

      {!isLoading && (
        <p style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>
          {isRecording ? "Listening... Click to stop." : "Tap to start recording"}
        </p>
      )}
    </div>
  );
}
