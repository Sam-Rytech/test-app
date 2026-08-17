"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav className="navbar" style={{ marginBottom: '0' }}>
        <div className="container">
          <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo.png" alt="Pavictek Logo" width={75} height={75} style={{ objectFit: 'contain' }} />
            <span>Tests <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>| Employee</span></span>
          </div>
          <div className="nav-links">
            <Link href="/employee/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Logout</button>
          </div>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '40px 0' }}>
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}
