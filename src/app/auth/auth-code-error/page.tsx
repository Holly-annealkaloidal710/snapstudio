import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Lỗi Xác thực</h1>
      <p style={{ marginBottom: '2rem' }}>Đã có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.</p>
      <Link href="/login" style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#0070f3',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '0.5rem'
      }}>
        Quay lại trang Đăng nhập
      </Link>
    </div>
  )
}