import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, Scan, RefreshCw, UserCheck } from 'lucide-react';
import { ConfirmModal } from '../../../../../shared/src';

interface Props {
  onToast: (msg: string) => void;
}

export const VerificationDeskView: React.FC<Props> = ({ onToast }) => {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Enterprise Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
    onConfirm: () => {},
  });

  // Simulated Verification Submissions Queue
  const [requests, setRequests] = useState<any[]>([
    {
      id: 'VER-90821',
      business_name: 'Afrobeat Music Group Ltd',
      organizer_name: 'Babatunde Smith',
      email: 'babatunde@afrobeats.com',
      doc_type: 'National ID (NIN)',
      doc_number: 'NIN-90821489102',
      confidence_score: 94.8,
      quality_score: '98.5% Clear',
      tampering_detected: false,
      ai_decision: 'AUTO_APPROVED',
      status: 'APPROVED',
      submitted_at: '2026-08-09 10:15',
      ocr_data: {
        detected_name: 'BABATUNDE SMITH',
        dob: '1992-08-14',
        expiry: '2030-12-31',
        country: 'Nigeria',
      },
      id_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    },
    {
      id: 'VER-89104',
      business_name: 'Lagos Beach Party LLC',
      organizer_name: 'Chidi Okafor',
      email: 'chidi@lagosbeach.ng',
      doc_type: 'International Passport',
      doc_number: 'PASS-A09821401',
      confidence_score: 82.4,
      quality_score: '84.0% Minor Blur',
      tampering_detected: false,
      ai_decision: 'FLAGGED_MANUAL_REVIEW',
      status: 'PENDING',
      submitted_at: '2026-08-09 09:40',
      ocr_data: {
        detected_name: 'CHIDI OKAFOR',
        dob: '1988-11-20',
        expiry: '2028-05-15',
        country: 'Nigeria',
      },
      id_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      selfie_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Approve Organizer Verification',
      message: `Approve verification request for "${name}"? This will grant full Organizer status and enable ticket sales.`,
      variant: 'info',
      onConfirm: () => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED', ai_decision: 'AUTO_APPROVED' } : r))
        );
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        onToast(`🎉 Organizer "${name}" has been approved!`);
      },
    });
  };

  const handleReject = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reject Verification Request',
      message: `Reject verification for "${name}"? The user will be notified to re-upload clear government ID.`,
      variant: 'danger',
      onConfirm: () => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
        );
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        onToast(`⚠️ Verification request for "${name}" was rejected.`);
      },
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>AI Identity Verification Approval Desk</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Review AI OCR text extractions, facial biometric match scores, document quality, &amp; approve organizer applications.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Verification ID</th>
                <th>Business &amp; Organizer</th>
                <th>Doc Type</th>
                <th>AI Match Score</th>
                <th>Doc Quality</th>
                <th>AI Decision</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#60A5FA' }}>{r.id}</td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#FFF' }}>{r.business_name}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{r.organizer_name} ({r.email})</div>
                  </td>
                  <td style={{ color: '#E5E7EB', fontWeight: 600 }}>{r.doc_type}</td>
                  <td>
                    <span style={{ fontWeight: 900, color: r.confidence_score >= 90 ? '#34D399' : '#FBBF24', fontSize: '13px' }}>
                      {r.confidence_score}%
                    </span>
                  </td>
                  <td style={{ fontSize: '11px', color: '#9CA3AF' }}>{r.quality_score}</td>
                  <td>
                    <span style={{ background: r.ai_decision === 'AUTO_APPROVED' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: r.ai_decision === 'AUTO_APPROVED' ? '#34D399' : '#FBBF24', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                      {r.ai_decision}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${r.status === 'APPROVED' ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => setSelectedRequest(r)}
                      >
                        <Eye size={12} /> Inspect
                      </button>
                      {r.status !== 'APPROVED' && (
                        <button
                          className="admin-btn admin-btn-success"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => handleApprove(r.id, r.organizer_name)}
                        >
                          <UserCheck size={12} /> Approve
                        </button>
                      )}
                      {r.status !== 'REJECTED' && (
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}
                          onClick={() => handleReject(r.id, r.organizer_name)}
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal Drawer */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-drawer" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>
                Verification Details: {selectedRequest.id}
              </h3>
              <span style={{ background: selectedRequest.confidence_score >= 90 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: selectedRequest.confidence_score >= 90 ? '#34D399' : '#FBBF24', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 900 }}>
                {selectedRequest.confidence_score}% MATCH SCORE
              </span>
            </div>

            {/* Side-by-Side Face Comparison Visualizer */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', marginBottom: '12px' }}>
                AI Biometric Face Match Comparison
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>Uploaded {selectedRequest.doc_type}</div>
                  <img src={selectedRequest.id_photo_url} alt="ID Document" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>Captured Live Selfie</div>
                  <img src={selectedRequest.selfie_url} alt="Live Selfie" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              </div>
            </div>

            {/* Extracted OCR Data Table */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', fontSize: '12.5px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', marginBottom: '10px' }}>Extracted OCR Text Data</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#9CA3AF' }}>Extracted Name:</span>
                <span style={{ color: '#FFF', fontWeight: 700 }}>{selectedRequest.ocr_data.detected_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#9CA3AF' }}>Date of Birth:</span>
                <span style={{ color: '#FFF' }}>{selectedRequest.ocr_data.dob}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#9CA3AF' }}>Document Number:</span>
                <span style={{ color: '#60A5FA', fontFamily: 'monospace' }}>{selectedRequest.doc_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Document Expiry:</span>
                <span style={{ color: '#FFF' }}>{selectedRequest.ocr_data.expiry}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="admin-btn admin-btn-success"
                style={{ flex: 1 }}
                onClick={() => {
                  handleApprove(selectedRequest.id, selectedRequest.organizer_name);
                  setSelectedRequest(null);
                }}
              >
                <UserCheck size={16} /> Approve Organizer
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ color: '#EF4444' }}
                onClick={() => {
                  handleReject(selectedRequest.id, selectedRequest.organizer_name);
                  setSelectedRequest(null);
                }}
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Confirm"
        cancelText="Cancel"
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
