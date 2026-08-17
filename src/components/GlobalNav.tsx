"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function GlobalNav({ session }: { session: any }) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide global nav on admin and employee routes, as they have their own navigation
  if (pathname.startsWith("/admin") || pathname.startsWith("/employee")) {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh(); // Refresh the server component to clear session prop
  };

  return (
    <nav className="navbar animate-fade-in">
      <div className="container">
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo.png" alt="Pavictek Logo" width={50} height={50} style={{ objectFit: 'contain' }} />
          <span>Tests</span>
        </Link>
        <div className="nav-links">
          {session ? (
            <>
              <Link
                href={session.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard"}
                className="nav-link"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-secondary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
