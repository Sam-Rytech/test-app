"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"EMPLOYEE" | "ADMIN">("EMPLOYEE");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = activeTab === "ADMIN"
        ? { role: "ADMIN", email, password }
        : { role: "EMPLOYEE", email, name };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/employee/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container animate-fade-in">
      <div className="auth-card glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Image src="/logo.png" alt="Pavictek Logo" width={80} height={80} style={{ objectFit: 'contain' }} />
        </div>
        <h1 style={{ textAlign: 'center' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center' }}>Log in to access Pavictek Tests</p>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setActiveTab("EMPLOYEE"); setError(""); }}
            style={{
              flex: 1, padding: '12px', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === "EMPLOYEE" ? 'var(--primary-color)' : 'var(--text-secondary)',
              borderBottom: activeTab === "EMPLOYEE" ? '2px solid var(--primary-color)' : '2px solid transparent',
              fontWeight: activeTab === "EMPLOYEE" ? 600 : 400
            }}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("ADMIN"); setError(""); }}
            style={{
              flex: 1, padding: '12px', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === "ADMIN" ? 'var(--primary-color)' : 'var(--text-secondary)',
              borderBottom: activeTab === "ADMIN" ? '2px solid var(--primary-color)' : '2px solid transparent',
              fontWeight: activeTab === "ADMIN" ? 600 : 400
            }}
          >
            Admin
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {activeTab === "EMPLOYEE" ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="form-group">
                <label>Work Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. employee@Pavictek.com"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Admin Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. admin@Pavictek.com"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </button>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
