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
        <div className="input-wrapper">
          <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || !certId.trim()}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner" />
          <span className="loading-text">Verifying credential...</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="result-container">
          <div className="result-card">
            <div className="badge-container">
              <svg className="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Verified Authentic
            </div>
            
            <div className="result-header">
              <h2 className="result-title">Official Certificate</h2>
              <div className="result-subtitle">ID: {result.id}</div>
            </div>

            <div className="result-grid">
              <div className="result-item full-width">
                <span className="result-label">Team / Member Name</span>
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
        </div>
      )}

      <footer>
        Bangalore Vibecoders Association — Independent Developer Community
      </footer>
    </main>
  );
}
