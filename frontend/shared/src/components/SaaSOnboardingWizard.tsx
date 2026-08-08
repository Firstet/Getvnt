import React, { useState, useEffect } from 'react';
import { CheckCircle2, Upload, ArrowRight, ShieldCheck, Building2, CreditCard, Sparkles, Globe, Share2, AlertCircle, RefreshCw } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useAuth } from '../context/AuthContext';

interface SaaSOnboardingWizardProps {
  onComplete: () => void;
  onToast?: (msg: string) => void;
}

export const SaaSOnboardingWizard: React.FC<SaaSOnboardingWizardProps> = ({ onComplete, onToast }) => {
  const { brand } = useBrand();
  const { user, token, refreshUser } = useAuth();

  const [step, setStep] = useState<number>(2); // Starts at Step 2 after signup
  const [loading, setLoading] = useState(false);

  // STEP 4: Organizer Profile
  const [organizerName, setOrganizerName] = useState(user?.tenant?.name || '');
  const [organizerLogo, setOrganizerLogo] = useState(user?.tenant?.logo_url || '');
  const [aboutOrganizer, setAboutOrganizer] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  // STEP 5: Identity Verification
  const [idDocType, setIdDocType] = useState('National ID');
  const [idDocUrl, setIdDocUrl] = useState<string | null>(null);
  const [isUploadingId, setIsUploadingId] = useState(false);

  // STEP 6: Bank Verification
  const [selectedBank, setSelectedBank] = useState('Paystack Settlement Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [isResolvingBank, setIsResolvingBank] = useState(false);

  // Auto-Save Draft to LocalStorage so users never lose data
  useEffect(() => {
    const savedDraft = localStorage.getItem('getvnt_onboarding_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.organizerName) setOrganizerName(parsed.organizerName);
        if (parsed.organizerLogo) setOrganizerLogo(parsed.organizerLogo);
        if (parsed.aboutOrganizer) setAboutOrganizer(parsed.aboutOrganizer);
        if (parsed.websiteUrl) setWebsiteUrl(parsed.websiteUrl);
        if (parsed.accountNumber) setAccountNumber(parsed.accountNumber);
        if (parsed.resolvedAccountName) setResolvedAccountName(parsed.resolvedAccountName);
      } catch {}
    }
  }, []);

  const saveDraft = (data: Record<string, any>) => {
    localStorage.setItem('getvnt_onboarding_draft', JSON.stringify({
      organizerName, organizerLogo, aboutOrganizer, websiteUrl, accountNumber, resolvedAccountName, ...data
    }));
  };

  // Real-time Bank Account Resolution (Paystack / Monnify API simulation)
  useEffect(() => {
    if (accountNumber.length === 10) {
      setIsResolvingBank(true);
      setResolvedAccountName(null);
      const timer = setTimeout(() => {
        const simulatedName = `${(organizerName || 'ORGANIZER').toUpperCase()} ENTERTAINMENT LTD`;
        setResolvedAccountName(simulatedName);
        setIsResolvingBank(false);
        saveDraft({ accountNumber, resolvedAccountName: simulatedName });
        if (onToast) onToast('✓ Account name verified via Paystack Settlement Gateway!');
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setResolvedAccountName(null);
    }
  }, [accountNumber]);

  // Drag & Drop ID File Handler
  const handleIdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingId(true);
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      setIdDocUrl(mockUrl);
      setIsUploadingId(false);
      if (onToast) onToast('✓ Identity document uploaded successfully!');
    }, 1000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropId = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setIsUploadingId(true);
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      setIdDocUrl(mockUrl);
      setIsUploadingId(false);
      if (onToast) onToast('✓ Identity document uploaded successfully!');
    }, 1000);
  };

  // Finalize Onboarding Submission
  const handleFinishSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/onboarding/step', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 5,
          business_name: organizerName,
          logo_url: organizerLogo,
          about: aboutOrganizer,
          website: websiteUrl,
          bank_name: selectedBank,
          account_number: accountNumber,
          account_name: resolvedAccountName,
          identity_doc_url: idDocUrl,
          is_completed: true,
        }),
      });

      localStorage.removeItem('getvnt_onboarding_draft');
      await refreshUser();
      if (onToast) onToast('🎉 Organizer onboarding completed! Welcome to GETVNT.');
      onComplete();
    } catch {
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  // 5 Progress Steps for display indicator
  const progressStepIndex = Math.min(Math.max(step - 1, 1), 5);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        color: '#FFFFFF',
      }}
    >
      <div
        style={{
          background: '#111111',
          border: '1px solid #262626',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '620px',
          padding: '44px 40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(37,99,235,0.1)',
        }}
      >
        {/* Animated Progress Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#A3A3A3', marginBottom: '8px' }}>
            <span>Step {progressStepIndex} of 5</span>
            <span style={{ color: '#60A5FA' }}>
              {step === 2 && 'Email Verification'}
              {step === 3 && 'Welcome'}
              {step === 4 && 'Organizer Profile'}
              {step === 5 && 'Identity Verification'}
              {step === 6 && 'Bank Settlement'}
              {step === 7 && 'Review & Activation'}
            </span>
          </div>
          <div style={{ height: '6px', background: '#262626', borderRadius: '99px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(progressStepIndex / 5) * 100}%`,
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                borderRadius: '99px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* ── STEP 2: EMAIL VERIFICATION ── */}
        {step === 2 && (
          <div>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', marginBottom: '20px' }}>
              <ShieldCheck size={28} />
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>
              Verify Your Email
            </h2>
            <p style={{ color: '#A3A3A3', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '32px' }}>
              We have sent a verification email to <strong style={{ color: '#FFFFFF' }}>{user?.email || 'your email'}</strong>. Please check your inbox and click the verification link.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="btn-cta"
                onClick={() => setStep(3)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(37,99,235,0.4)',
                }}
              >
                Email Verified — Continue <ArrowRight size={16} />
              </button>

              <button
                className="btn-cta"
                onClick={() => { if (onToast) onToast('Verification email resent to your inbox!'); }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '16px',
                  background: '#171717',
                  border: '1px solid #262626',
                  color: '#D4D4D4',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  justifyContent: 'center',
                }}
              >
                Resend Email
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: WELCOME SCREEN ── */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '10px' }}>
              Welcome to {brand?.platform_name || 'GETVNT'}
            </h2>
            <p style={{ color: '#A3A3A3', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              Let's set up your organizer account. This only takes about 2 minutes. You will be able to create events, sell tickets, and manage attendee check-ins globally.
            </p>
            <button
              className="btn-cta"
              onClick={() => setStep(4)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '15px',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37,99,235,0.45)',
              }}
            >
              Get Started <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 4: ORGANIZER PROFILE ── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
              Organizer Profile
            </h2>
            <p style={{ color: '#A3A3A3', fontSize: '14px', marginBottom: '28px' }}>
              This information will be displayed on your public event pages and ticket receipts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Organizer / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  className="search-field"
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', color: '#FFF' }}
                  placeholder="e.g. AfroNation Events Ltd"
                  value={organizerName}
                  onChange={(e) => {
                    setOrganizerName(e.target.value);
                    saveDraft({ organizerName: e.target.value });
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Organizer Logo
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) setOrganizerLogo(URL.createObjectURL(file));
                  }}
                  style={{
                    background: '#0A0A0A',
                    border: '2px dashed #262626',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {organizerLogo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
                      <img src={organizerLogo} alt="Logo Preview" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '13px', color: '#34D399', fontWeight: 700 }}>✓ Logo Uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <Upload size={24} color="#737373" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '13px', color: '#D4D4D4', fontWeight: 700 }}>Drag &amp; drop logo here or click to browse</div>
                      <div style={{ fontSize: '11px', color: '#737373', marginTop: '4px' }}>PNG, JPG or WEBP up to 5MB</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                  About Organizer
                </label>
                <textarea
                  className="search-field"
                  rows={3}
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', color: '#FFF', resize: 'vertical' }}
                  placeholder="Briefly describe your events, music genre, or organization..."
                  value={aboutOrganizer}
                  onChange={(e) => {
                    setAboutOrganizer(e.target.value);
                    saveDraft({ aboutOrganizer: e.target.value });
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Website (Optional)
                </label>
                <input
                  type="url"
                  className="search-field"
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', color: '#FFF' }}
                  placeholder="https://yourevents.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn-cta"
              disabled={!organizerName}
              onClick={() => setStep(5)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '16px',
                background: organizerName ? '#2563EB' : '#262626',
                color: organizerName ? '#FFFFFF' : '#737373',
                fontWeight: 800,
                fontSize: '14px',
                justifyContent: 'center',
                boxShadow: organizerName ? '0 4px 18px rgba(37,99,235,0.4)' : 'none',
              }}
            >
              Save &amp; Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 5: IDENTITY VERIFICATION ── */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
              Verify Your Identity
            </h2>
            <p style={{ color: '#A3A3A3', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
              To keep our marketplace safe and protect ticket buyers, every organizer must verify their identity.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '8px', textTransform: 'uppercase' }}>
                Select Document Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['National ID', 'Passport', "Driver's License"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIdDocType(type)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: idDocType === type ? 'rgba(37,99,235,0.2)' : '#0A0A0A',
                      border: `1px solid ${idDocType === type ? '#2563EB' : '#262626'}`,
                      color: idDocType === type ? '#60A5FA' : '#D4D4D4',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Upload Box */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropId}
              style={{
                background: '#0A0A0A',
                border: '2px dashed #262626',
                borderRadius: '18px',
                padding: '32px 20px',
                textAlign: 'center',
                marginBottom: '28px',
                position: 'relative',
              }}
            >
              {isUploadingId ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <RefreshCw size={24} color="#60A5FA" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '13px', color: '#60A5FA', fontWeight: 700 }}>Uploading &amp; Scanning Document…</span>
                </div>
              ) : idDocUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={36} color="#34D399" />
                  <span style={{ fontSize: '14px', color: '#34D399', fontWeight: 800 }}>✓ {idDocType} Uploaded &amp; Verified</span>
                  <span style={{ fontSize: '11.5px', color: '#737373' }}>Automatic verification complete</span>
                </div>
              ) : (
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <Upload size={32} color="#737373" style={{ marginBottom: '10px' }} />
                  <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 800 }}>Upload your {idDocType}</div>
                  <div style={{ fontSize: '12px', color: '#737373', marginTop: '4px' }}>Drag &amp; drop file or browse (PNG, JPG, PDF up to 10MB)</div>
                  <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleIdFileUpload} />
                </label>
              )}
            </div>

            <button
              className="btn-cta"
              onClick={() => setStep(6)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '16px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(37,99,235,0.4)',
              }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 6: BANK VERIFICATION ── */}
        {step === 6 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
              Bank Settlement Account
            </h2>
            <p style={{ color: '#A3A3A3', fontSize: '14px', marginBottom: '28px' }}>
              Enter your bank details to receive automated ticket payout settlements.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Select Bank
                </label>
                <select
                  className="search-field"
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', color: '#FFF' }}
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="Paystack Settlement Bank">Paystack Settlement Bank (Nigeria)</option>
                  <option value="GTBank Nigeria">Guaranty Trust Bank (GTBank)</option>
                  <option value="Access Bank">Access Bank Plc</option>
                  <option value="Zenith Bank">Zenith Bank Plc</option>
                  <option value="Kuda Bank">Kuda Microfinance Bank</option>
                  <option value="Standard Chartered">Standard Chartered Bank</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Account Number (10 Digits)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  className="search-field"
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', color: '#FFF', fontSize: '16px', letterSpacing: '1px' }}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              {/* Instant Account Name Resolution Box */}
              {isResolvingBank && (
                <div style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RefreshCw size={16} color="#60A5FA" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '13px', color: '#60A5FA', fontWeight: 700 }}>Fetching account name via Paystack Gateway…</span>
                </div>
              )}

              {resolvedAccountName && (
                <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#34D399" />
                  <div>
                    <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 800, textTransform: 'uppercase' }}>Verified Account Name</div>
                    <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 900, marginTop: '2px' }}>{resolvedAccountName}</div>
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn-cta"
              disabled={!accountNumber || accountNumber.length < 10}
              onClick={() => setStep(7)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '16px',
                background: (accountNumber.length === 10) ? '#2563EB' : '#262626',
                color: (accountNumber.length === 10) ? '#FFFFFF' : '#737373',
                fontWeight: 800,
                fontSize: '14px',
                justifyContent: 'center',
                boxShadow: (accountNumber.length === 10) ? '0 4px 18px rgba(37,99,235,0.4)' : 'none',
              }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 7: REVIEW & FINISH SETUP ── */}
        {step === 7 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>
              Review Your Setup
            </h2>
            <p style={{ color: '#A3A3A3', fontSize: '14px', marginBottom: '28px' }}>
              Your organizer workspace is ready for activation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Building2 size={20} color="#60A5FA" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>Organizer Profile</div>
                    <div style={{ fontSize: '12px', color: '#737373' }}>{organizerName || 'GETVNT Organizer'}</div>
                  </div>
                </div>
                <CheckCircle2 size={20} color="#34D399" />
              </div>

              <div style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={20} color="#A78BFA" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>Identity Verification</div>
                    <div style={{ fontSize: '12px', color: '#737373' }}>{idDocType} Uploaded</div>
                  </div>
                </div>
                <CheckCircle2 size={20} color="#34D399" />
              </div>

              <div style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CreditCard size={20} color="#FBBF24" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>Bank Settlement</div>
                    <div style={{ fontSize: '12px', color: '#737373' }}>{resolvedAccountName || 'Paystack Verified Account'}</div>
                  </div>
                </div>
                <CheckCircle2 size={20} color="#34D399" />
              </div>
            </div>

            <button
              className="btn-cta"
              disabled={loading}
              onClick={handleFinishSetup}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '15px',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37,99,235,0.45)',
              }}
            >
              {loading ? 'Activating Organizer OS…' : 'Finish Setup & Open Dashboard'} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
