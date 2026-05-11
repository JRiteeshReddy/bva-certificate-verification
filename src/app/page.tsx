'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface CertificateData {
  id: string;
  names: string;
  event: string;
  position: string;
  date: string;
}

export default function VerificationPage() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyId = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/verify?id=${encodeURIComponent(id.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setCertId(idFromUrl);
      verifyId(idFromUrl);
    }
  }, [verifyId]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyId(certId);
  };

  return (
    <main>
      <div className="logo-container">
        <Image 
          src="/logo.png" 
          alt="Bangalore Vibecoders Association" 
          width={300} 
          height={100} 
          priority
          style={{ objectFit: 'contain', width: 'auto', height: '80px' }}
        />
      </div>

      <div className="verification-header">
        <h1>Certificate Verification</h1>
        <p>
          Enter your certificate ID below to verify its authenticity with the 
          Bangalore Vibecoders Association.
        </p>
      </div>

      <form className="form-container" onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !certId.trim()}>
          {loading ? '...' : 'Verify'}
        </button>
      </form>

      {loading && <div className="loading-spinner" />}

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="result-container">
          <div className="result-card">
            <div className="result-item">
              <span className="result-label">Team Members</span>
              <span className="result-value">{result.names}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Event Name</span>
              <span className="result-value">{result.event}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Position</span>
              <span className="result-value position">{result.position}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Date of Issue</span>
              <span className="result-value">{result.date}</span>
            </div>
          </div>
        </div>
      )}

      <footer>
        Bangalore Vibecoders Association — Independent Developer Community
      </footer>
    </main>
  );
}
