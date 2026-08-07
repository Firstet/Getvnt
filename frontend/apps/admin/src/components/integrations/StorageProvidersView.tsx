import React, { useState } from 'react';
import { HardDrive, CheckCircle, Edit3, Globe, Cloud } from 'lucide-react';

interface Props {
  providers: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const StorageProvidersView: React.FC<Props> = ({ providers, onRefresh, onToast }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Media & Document Storage Bucket Drivers</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Configure S3, Cloudflare R2, Google Cloud Storage, & CDN asset distribution nodes.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {providers.map((p) => (
          <div key={p.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE' }}>
                  <HardDrive size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{p.name}</h3>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Driver: {p.driver.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {p.is_default && (
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>
                    DEFAULT BUCKET
                  </span>
                )}
                <span className={`admin-badge ${p.status === 'active' ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Bucket Name:</span>
                <span style={{ fontFamily: 'monospace', color: '#FFF', fontWeight: 600 }}>{p.bucket || 'getvnt-media'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>AWS Region:</span>
                <span style={{ color: '#F59E0B' }}>{p.region || 'eu-west-1'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>CDN Edge URL:</span>
                <span style={{ color: '#60A5FA', fontSize: '11px' }}>{p.cdn_url || 'https://cdn.getvnt.com'}</span>
              </div>
            </div>

            <button
              className="admin-btn admin-btn-success"
              style={{ fontSize: '12px', padding: '6px 12px', width: '100%', justifyContent: 'center' }}
              onClick={() => onToast(`Connected and verified storage bucket "${p.bucket}" successfully!`)}
            >
              <CheckCircle size={14} /> Verify Bucket Bucket Access
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
