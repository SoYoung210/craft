import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>404: Not Found</h1>
      <p style={{ marginTop: 12 }}>
        <Link href="/" style={{ color: '#3a8bfd' }}>
          Go back home
        </Link>
      </p>
    </main>
  );
}
