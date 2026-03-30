const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

const shimmerStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
};

function CardSkeleton({ count }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ ...shimmerStyle, width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...shimmerStyle, height: 14, borderRadius: 6, marginBottom: 8, width: '70%' }} />
              <div style={{ ...shimmerStyle, height: 10, borderRadius: 6, width: '50%' }} />
            </div>
          </div>
          <div style={{ ...shimmerStyle, height: 10, borderRadius: 6, marginBottom: 10, width: '100%' }} />
          <div style={{ ...shimmerStyle, height: 10, borderRadius: 6, marginBottom: 10, width: '85%' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <div style={{ ...shimmerStyle, height: 24, borderRadius: 12, width: 60 }} />
            <div style={{ ...shimmerStyle, height: 24, borderRadius: 12, width: 60 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ count }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '14px 22px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
        <div style={{ ...shimmerStyle, height: 12, borderRadius: 6, width: '40%' }} />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ padding: '14px 22px', borderBottom: i < count - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ ...shimmerStyle, width: 36, height: 36, borderRadius: 9, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...shimmerStyle, height: 12, borderRadius: 6, marginBottom: 8, width: '60%' }} />
            <div style={{ ...shimmerStyle, height: 9, borderRadius: 6, width: '40%' }} />
          </div>
          <div style={{ ...shimmerStyle, height: 22, borderRadius: 11, width: 70 }} />
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ ...shimmerStyle, width: 34, height: 34, borderRadius: 8, marginBottom: 12 }} />
          <div style={{ ...shimmerStyle, height: 20, borderRadius: 6, width: '50%', marginBottom: 6 }} />
          <div style={{ ...shimmerStyle, height: 10, borderRadius: 6, width: '70%' }} />
        </div>
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ rows = 4, type = 'card' }) {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div style={{ padding: 28, maxWidth: 1200, minHeight: '100%', background: '#f5f5f5' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...shimmerStyle, height: 22, borderRadius: 8, width: 220, marginBottom: 10 }} />
          <div style={{ ...shimmerStyle, height: 12, borderRadius: 6, width: 320 }} />
        </div>
        <StatsSkeleton />
        {type === 'card' && <CardSkeleton count={rows} />}
        {type === 'table' && <TableSkeleton count={rows} />}
        {type === 'list' && <TableSkeleton count={rows} />}
      </div>
    </>
  );
}
