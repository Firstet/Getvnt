import React, { useState } from 'react';
import { apiClient } from '../../../../shared/src';
import {
  Ticket, Search, QrCode, Download, Mail, RefreshCw, CheckCircle2,
  Calendar, MapPin, ShieldCheck, ArrowRight, ChevronLeft, AlertCircle,
  Smartphone, ExternalLink, Clock, Copy, Check, Share2
} from 'lucide-react';

interface Props {
  onBackToExplore: () => void;
  onToast?: (msg: string) => void;
  initialQuery?: string;
}

export const TicketManagementPortal: React.FC<Props> = ({
  onBackToExplore,
  onToast,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchMethod, setSearchMethod] = useState<'ref' | 'email' | 'phone'>('ref');
  const [isSearching, setIsSearching] = useState(false);
  const [ticketResult, setTicketResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const triggerToast = (msg: string) => {
    if (onToast) onToast(msg);
  };

  const [searchError, setSearchError] = useState<{ code: string; message: string } | null>(null);

  const handleLookupTicket = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearched(true);
    setTicketResult(null);
    setSearchError(null);

    try {
      const json = await apiClient.get(`/orders/lookup?query=${encodeURIComponent(searchQuery.trim())}`);

      if (json.success && json.data) {
        setTicketResult({
          ...json.data,
          status_code: json.code || json.data.status_code || 'VALID',
          message: json.message,
        });
      } else {
        setSearchError({
          code: json.code || 'INVALID_CODE',
          message: json.message || `Invalid Ticket Code. No active ticket matching "${searchQuery}" was found on GETVNT.`,
        });
      }
    } catch (err: any) {
      const errRes = err?.response?.data;
      setSearchError({
        code: errRes?.code || 'INVALID_CODE',
        message: errRes?.message || `Invalid Ticket Code. No active ticket matching "${searchQuery}" was found on GETVNT.`,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyQrHash = () => {
    if (ticketResult?.qr_code_hash) {
      navigator.clipboard.writeText(ticketResult.qr_code_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
      triggerToast('Copied QR security token to clipboard!');
    }
  };

  const handleResendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
    triggerToast(`Ticket pass re-sent to ${ticketResult?.buyer_email}!`);
  };

  const handleDownloadPdf = () => {
    triggerToast('Generating official PDF Ticket Pass with anti-counterfeit QR watermark...');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 20px 80px', color: '#FFF', fontFamily: "'Inter', sans-serif" }}>

      {/* Back Button */}
      <button
        onClick={onBackToExplore}
        style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#60A5FA', padding: '8px 16px', borderRadius: '10px', fontSize: '13px',
          fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px'
        }}
      >
        <ChevronLeft size={16} /> Back to Explore Events
      </button>

      {/* Hero Header */}
      <div style={{
        backgroundImage: 'linear-gradient(135deg, rgba(13,17,32,0.85), rgba(37,99,235,0.75)), url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: '1px solid rgba(37,99,235,0.4)', borderRadius: '28px', padding: '48px', marginBottom: '36px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', color: '#60A5FA', padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 900, marginBottom: '14px' }}>
          <Ticket size={15} /> Frictionless Guest Ticket Portal
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '12px', lineHeight: 1.2 }}>
          Manage &amp; Validate Your Event Ticket
        </h1>
        <p style={{ color: '#D1D5DB', fontSize: '15.5px', maxWidth: '680px', lineHeight: 1.6 }}>
          No login or account registration required. Lookup your tickets using your Order Reference Number, Ticket ID, Email Address, or Mobile Phone Number.
        </p>
      </div>

      {/* Lookup Card Container */}
      <div style={{ background: 'rgba(13, 17, 32, 0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'ref', label: 'Order Reference / Ticket ID' },
            { id: 'email', label: 'Email Address' },
            { id: 'phone', label: 'Phone Number' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSearchMethod(m.id as any)}
              style={{
                padding: '8px 16px', borderRadius: '99px', fontSize: '12.5px', fontWeight: 800,
                background: searchMethod === m.id ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'rgba(255,255,255,0.04)',
                border: searchMethod === m.id ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.08)',
                color: searchMethod === m.id ? '#FFF' : '#9CA3AF', cursor: 'pointer'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLookupTicket} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              required
              className="search-field"
              placeholder={
                searchMethod === 'ref' ? 'e.g. GETVNT-ORD-882910 or TKT-1001-A89B' :
                searchMethod === 'email' ? 'Enter email used during checkout...' :
                'Enter phone number (e.g. +234 803 000 0000)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '44px', width: '100%', fontSize: '14px', height: '48px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="btn-cta"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFF', padding: '12px 28px', fontSize: '14px', borderRadius: '12px' }}
          >
            {isSearching ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
            {isSearching ? 'Searching...' : 'Find My Ticket'}
          </button>
        </form>
      </div>

      {/* Ticket Lookup Error / Not Found Display */}
      {searched && searchError && !isSearching && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.15)'
        }}>
          <AlertCircle size={36} color="#F87171" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FCA5A5', marginBottom: '8px' }}>
            Invalid Ticket Code
          </h3>
          <p style={{ color: '#E5E7EB', fontSize: '14.5px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.5 }}>
            {searchError.message}
          </p>
        </div>
      )}

      {/* Ticket Result Display */}
      {ticketResult && (
        <div style={{
          background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)',
          border: ticketResult.status_code === 'EVENT_CANCELLED' ? '1px solid rgba(239,68,68,0.6)' :
                  ticketResult.status_code === 'TICKET_EXPIRED' ? '1px solid rgba(245,158,11,0.6)' :
                  ticketResult.status_code === 'ALREADY_CHECKED_IN' ? '1px solid rgba(234,179,8,0.6)' :
                  '1px solid rgba(37,99,235,0.4)',
          borderRadius: '28px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
        }}>

          {/* Status Alert Banner if Cancelled, Expired, or Already Checked In */}
          {ticketResult.status_code === 'EVENT_CANCELLED' && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={24} color="#F87171" />
              <div>
                <div style={{ fontWeight: 900, color: '#FCA5A5', fontSize: '15px' }}>EVENT CANCELLED</div>
                <div style={{ fontSize: '13px', color: '#F3F4F6' }}>This event has been cancelled by the organizer. Attendees can request a full refund.</div>
              </div>
            </div>
          )}

          {ticketResult.status_code === 'TICKET_EXPIRED' && (
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #F59E0B', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={24} color="#FBBF24" />
              <div>
                <div style={{ fontWeight: 900, color: '#FDE68A', fontSize: '15px' }}>TICKET EXPIRED</div>
                <div style={{ fontSize: '13px', color: '#F3F4F6' }}>This ticket pass has expired as the event date has passed.</div>
              </div>
            </div>
          )}

          {ticketResult.status_code === 'ALREADY_CHECKED_IN' && (
            <div style={{ background: 'rgba(234, 179, 8, 0.2)', border: '1px solid #EAB308', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={24} color="#FACC15" />
              <div>
                <div style={{ fontWeight: 900, color: '#FEF08A', fontSize: '15px' }}>ALREADY CHECKED IN</div>
                <div style={{ fontSize: '13px', color: '#F3F4F6' }}>
                  This ticket was already checked in at gate scanner ({ticketResult.checked_in_at || 'Recorded'}).
                </div>
              </div>
            </div>
          )}

          {/* Ticket Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  background: ticketResult.status_code === 'VALID' ? 'rgba(16,185,129,0.18)' :
                              ticketResult.status_code === 'EVENT_CANCELLED' ? 'rgba(239,68,68,0.2)' :
                              ticketResult.status_code === 'TICKET_EXPIRED' ? 'rgba(245,158,11,0.2)' : 'rgba(234,179,8,0.2)',
                  color: ticketResult.status_code === 'VALID' ? '#34D399' :
                         ticketResult.status_code === 'EVENT_CANCELLED' ? '#F87171' :
                         ticketResult.status_code === 'TICKET_EXPIRED' ? '#FBBF24' : '#FACC15',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}>
                  <CheckCircle2 size={12} /> {ticketResult.status} Ticket
                </span>
                <span style={{ background: 'rgba(37,99,235,0.18)', color: '#60A5FA', border: '1px solid rgba(37,99,235,0.4)', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                  {ticketResult.check_in_status}
                </span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>
                {ticketResult.event_title}
              </h2>
              <div style={{ fontSize: '13.5px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span>📍 {ticketResult.venue_name}, {ticketResult.city}</span>
                <span>📅 {ticketResult.event_date} ({ticketResult.event_time})</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>ORDER REFERENCE</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>
                {ticketResult.order_number}
              </div>
            </div>
          </div>

          {/* Ticket Details & QR Scanner Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', marginBottom: '32px' }}>

            {/* Left Info Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>TICKET PASS TYPE</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFF' }}>{ticketResult.ticket_type}</div>
                <div style={{ fontSize: '12px', color: '#60A5FA', marginTop: '2px' }}>Quantity: {ticketResult.quantity} Pass(es)</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>BUYER DETAILS</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>{ticketResult.buyer_name}</div>
                <div style={{ fontSize: '12.5px', color: '#9CA3AF' }}>{ticketResult.buyer_email}</div>
                {ticketResult.buyer_phone && <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{ticketResult.buyer_phone}</div>}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>PAYMENT SUMMARY</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#34D399' }}>
                  {ticketResult.currency} {ticketResult.amount_paid?.toLocaleString()} ({ticketResult.payment_status})
                </div>
              </div>
            </div>

            {/* Right QR Barcode Scanner Box */}
            <div style={{ background: 'rgba(13, 17, 32, 0.95)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '20px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#FFF', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', marginBottom: '16px' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ticketResult.qr_code_hash)}`}
                  alt="Ticket QR Scanner Code"
                  style={{ width: '160px', height: '160px', display: 'block' }}
                />
              </div>

              <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}>ANTI-COUNTERFEIT QR TOKEN</div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={handleCopyQrHash}>
                {ticketResult.qr_code_hash} {copiedHash ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Present this QR code at the door for fast entrance scanning</div>
            </div>

          </div>

          {/* Action Buttons Toolbar */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
            <button
              onClick={handleDownloadPdf}
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFF', padding: '12px 20px', borderRadius: '10px', fontSize: '13px' }}
            >
              <Download size={15} /> Download PDF Ticket Pass
            </button>

            <button
              onClick={handleResendEmail}
              className="btn-cta btn-cta-ghost"
              disabled={emailSent}
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', padding: '12px 20px', borderRadius: '10px', fontSize: '13px' }}
            >
              <Mail size={15} /> {emailSent ? 'Email Sent!' : 'Re-send Ticket Email'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

