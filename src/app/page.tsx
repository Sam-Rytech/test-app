import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container animate-fade-in">
      <div className="auth-container" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <div className="auth-card glass-panel" style={{ maxWidth: '600px', padding: '60px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <Image src="/logo.png" alt="Pavictek Logo" width={100} height={100} style={{ objectFit: 'contain' }} />
            <h1 style={{ fontSize: '3rem', margin: 0 }}>Tests</h1>
          </div>
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
