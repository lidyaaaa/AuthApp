export default function Forbidden() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '32rem',
        width: '100%'
      }}>
        {/* Error Code */}
        <h1 style={{
          fontSize: '6rem',
          fontWeight: 800,
          color: '#1e293b',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.025em'
        }}>
          403
        </h1>
        
        {/* Title */}
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          color: '#1e293b',
          margin: '1rem 0 0.5rem'
        }}>
          Akses Ditolak
        </h2>
        
        {/* Description */}
        <p style={{
          color: '#64748b',
          fontSize: '1.125rem',
          lineHeight: 1.6,
          margin: '0 0 2rem'
        }}>
          Kamu tidak memiliki izin untuk mengakses halaman ini.
        </p>
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '20rem',
          margin: '0 auto'
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#1e293b',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 500,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
          >
            ← Kembali
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: 'white',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 500,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Ke Beranda
          </button>
        </div>
        
        {/* Help Text */}
        <p style={{
          color: '#94a3b8',
          fontSize: '0.875rem',
          margin: '2rem 0 0'
        }}>
          Hubungi administrator jika kamu merasa ini kesalahan
        </p>
      </div>
    </div>
  );
}