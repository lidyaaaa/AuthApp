export default function Unauthorized() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fefce8',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '32rem',
        width: '100%'
      }}>
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          backgroundColor: '#fef3c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #f59e0b'
        }}>
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#d97706"
            strokeWidth="2"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>

        {/* Error Code */}
        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          color: '#92400e',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.025em'
        }}>
          401
        </h1>
        
        {/* Title */}
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#92400e',
          margin: '0.75rem 0 0.5rem'
        }}>
          Akses Tidak Diizinkan
        </h2>
        
        {/* Description */}
        <p style={{
          color: '#b45309',
          fontSize: '1.125rem',
          lineHeight: 1.6,
          margin: '0 0 2rem'
        }}>
          Kamu perlu login untuk mengakses halaman ini.
        </p>
        
        {/* Login Button */}
        <div style={{
          margin: '0 auto 1.5rem',
          maxWidth: '16rem'
        }}>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              backgroundColor: '#d97706',
              color: 'white',
              border: 'none',
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(217, 119, 6, 0.3)',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#b45309';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(217, 119, 6, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(217, 119, 6, 0.3)';
            }}
          >
            🔐 Login Sekarang
          </button>
        </div>
        
        {/* Alternative Options */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: 'transparent',
              color: '#92400e',
              border: '1px solid #f59e0b',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ← Kembali
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: 'transparent',
              color: '#92400e',
              border: '1px solid #f59e0b',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🏠 Beranda
          </button>
        </div>
        
        {/* Help Text */}
        <p style={{
          color: '#92400e',
          fontSize: '0.875rem',
          margin: 0,
          opacity: 0.8
        }}>
          Tidak punya akun?{' '}
          <a 
            href="/register" 
            style={{
              color: '#d97706',
              textDecoration: 'none',
              fontWeight: 600
            }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  )
}