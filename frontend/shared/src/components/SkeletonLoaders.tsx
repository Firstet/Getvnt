import React from 'react';

// ─── SHIMMER PULSE ANIMATION WRAPPER ──────────────────────────────────────────
export const SkeletonShimmer: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}> = ({
  width = '100%',
  height = '20px',
  borderRadius = '10px',
  style = {},
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s infinite linear',
        ...style,
      }}
    />
  );
};

// ─── 1. EXECUTIVE DASHBOARD SKELETON ─────────────────────────────────────────
export const SkeletonDashboard: React.FC = () => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner Skeleton */}
      <div style={{ background: 'rgba(13, 18, 34, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px' }}>
        <SkeletonShimmer height={32} width="40%" style={{ marginBottom: '12px' }} />
        <SkeletonShimmer height={18} width="65%" style={{ marginBottom: '20px' }} />
        <SkeletonShimmer height={64} width="100%" borderRadius={16} />
      </div>

      {/* Launcher Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[...Array(5)].map((_, i) => (
          <SkeletonShimmer key={i} height={90} borderRadius={16} />
        ))}
      </div>

      {/* KPI Cards Row Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {[...Array(3)].map((_, i) => (
          <SkeletonShimmer key={i} height={120} borderRadius={20} />
        ))}
      </div>

      {/* Chart Section Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <SkeletonShimmer height={320} borderRadius={24} />
        <SkeletonShimmer height={320} borderRadius={24} />
      </div>
    </div>
  );
};

// ─── 2. DATA TABLE SKELETON ──────────────────────────────────────────────────
export const SkeletonTable: React.FC = () => {
  return (
    <div style={{ background: 'rgba(13, 18, 34, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px', width: '100%' }}>
      {/* Header controls skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <SkeletonShimmer height={40} width="30%" borderRadius={12} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <SkeletonShimmer height={40} width={100} borderRadius={12} />
          <SkeletonShimmer height={40} width={120} borderRadius={12} />
        </div>
      </div>

      {/* Table rows skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[...Array(6)].map((_, i) => (
          <SkeletonShimmer key={i} height={52} borderRadius={12} />
        ))}
      </div>
    </div>
  );
};

// ─── 3. CARD GRID SKELETON ───────────────────────────────────────────────────
export const SkeletonCardGrid: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ background: 'rgba(13, 18, 34, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <SkeletonShimmer height={160} borderRadius={14} />
          <SkeletonShimmer height={22} width="80%" />
          <SkeletonShimmer height={16} width="50%" />
          <SkeletonShimmer height={40} borderRadius={12} style={{ marginTop: 'auto' }} />
        </div>
      ))}
    </div>
  );
};

// ─── 4. BUILDER CANVAS SKELETON ──────────────────────────────────────────────
export const SkeletonCanvas: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', width: '100%', height: 'calc(100vh - 120px)' }}>
      <SkeletonShimmer height="100%" borderRadius={20} />
      <SkeletonShimmer height="100%" borderRadius={20} />
    </div>
  );
};
