"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="glass-panel" style={{ width: '250px', padding: '20px', borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <Image src="/logo.png" alt="Pavictek Logo" width={90} height={90} style={{ objectFit: 'contain' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Panel
          </h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/admin/tests" className="nav-link">Manage Tests</Link>
          <Link href="/admin/results" className="nav-link">View Results</Link>
          <Link href="/admin/settings" className="nav-link">Settings</Link>
        </nav>
        
        <button 
          onClick={handleLogout}
          className="btn btn-secondary" 
          style={{ position: 'absolute', bottom: '20px', left: '20px', width: '210px' }}>
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
