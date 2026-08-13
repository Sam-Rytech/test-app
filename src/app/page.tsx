import Link from "next/link";

export default function Home() {
  return (
    <main className="container animate-fade-in">
      <div className="auth-container" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <div className="auth-card glass-panel" style={{ maxWidth: '600px', padding: '60px 40px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Pavictek Tests</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
            A premium internal platform for managing and taking organizational assessments.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
