import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Calendar, Activity } from 'lucide-react';

export default function PatientList({ onView }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/documents");
        setDocuments(res.data);
      } catch(err) {
        console.error("Failed to load documents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const filteredDocs = documents.filter(doc => 
    (doc.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (doc.diagnosis || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading records...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>Saved Records</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search patients, diagnosis..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No records found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredDocs.map(doc => (
            <div key={doc.id} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{doc.patient_name}</h4>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Activity size={14}/> {doc.diagnosis || 'No diagnosis'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14}/> {doc.date || new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => onView(doc)}>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
