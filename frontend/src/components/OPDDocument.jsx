import React, { useState } from 'react';
import { Save, Printer, ArrowLeft } from 'lucide-react';

export default function OPDDocument({ document, onSave, onBack }) {
  const [docData, setDocData] = useState(document);

  if (!docData) return null;

  const handleChange = (key, value) => {
    setDocData({ ...docData, [key]: value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>Review OPD Document</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={18} /> Print
          </button>
          <button className="btn btn-primary" onClick={() => onSave(docData)}>
            <Save size={18} /> {document.id ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Patient Name</label>
          <input type="text" value={docData.patient_name || ''} onChange={(e) => handleChange('patient_name', e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Age</label>
            <input type="text" value={docData.age || ''} onChange={(e) => handleChange('age', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Gender</label>
            <input type="text" value={docData.gender || ''} onChange={(e) => handleChange('gender', e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Chief Complaint</label>
        <textarea rows={3} value={docData.chief_complaint || ''} onChange={(e) => handleChange('chief_complaint', e.target.value)} />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>History</label>
        <textarea rows={3} value={docData.history || ''} onChange={(e) => handleChange('history', e.target.value)} />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Examination</label>
        <textarea rows={3} value={docData.examination || ''} onChange={(e) => handleChange('examination', e.target.value)} />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Diagnosis</label>
        <textarea rows={2} value={docData.diagnosis || ''} onChange={(e) => handleChange('diagnosis', e.target.value)} style={{ fontWeight: '500', color: '#0f172a' }} />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Prescription</label>
        <textarea rows={4} value={docData.prescription || ''} onChange={(e) => handleChange('prescription', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Advice</label>
          <textarea rows={2} value={docData.advice || ''} onChange={(e) => handleChange('advice', e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Follow Up</label>
          <input type="text" value={docData.follow_up || ''} onChange={(e) => handleChange('follow_up', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
