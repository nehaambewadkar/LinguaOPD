import React from 'react';
import { Languages, FileText, CheckCircle2 } from 'lucide-react';

export default function Transcript({ data, onGenerateDoc }) {
  if (!data) return null;

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', margin: 0 }}>
          <FileText size={24} />
          Consultation Transcript
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: '1rem', color: 'var(--primary)', fontWeight: 500 }}>
          <Languages size={18} />
          Detected Language: {data.language.toUpperCase()}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.8 }}>
          {data.translated_transcript || data.transcript}
        </p>
        
        {data.language !== 'en' && data.language !== 'english' && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
            <strong>Original ({data.language}):</strong> {data.transcript}
          </div>
        )}
      </div>

      {data.entities && data.entities.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Extracted Medical Terms:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.entities.map((ent, idx) => (
              <span key={idx} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={14} />
                {ent}
              </span>
            ))}
          </div>
        </div>
      )}

      <button className="btn btn-primary" onClick={onGenerateDoc} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
        Generate Formal OPD Document
      </button>
    </div>
  );
}
