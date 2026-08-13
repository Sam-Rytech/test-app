import Link from "next/link";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function EmployeeDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  
  if (!sessionCookie) {
    return <div>Please log in to view your dashboard.</div>;
  }
  
  const session = JSON.parse(sessionCookie.value);
  const userId = session.id;

  // Fetch all tests
  const allTests = await prisma.test.findMany({
    include: {
      questions: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch user's completed tests
  const completedResults = await prisma.result.findMany({
    where: {
      userId: userId
    },
    include: {
      test: true
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  // Map completed tests to easily check
  const completedTestIds = new Set(completedResults.map(r => r.testId));

  // Separate tests into available and completed
  const availableTests = allTests.filter(t => !completedTestIds.has(t.id));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {session.name}</p>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Available Tests</h2>
      <div className="card-grid" style={{ marginBottom: '40px' }}>
        {availableTests.map(test => (
          <div key={test.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '10px' }}>{test.title}</h3>
            {test.description && <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>{test.description}</p>}
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>📝 {test.questions.length} Questions</p>
            <Link href={`/employee/take-test/${test.id}`} className="btn btn-primary" style={{ marginTop: 'auto' }}>
              Start Test
            </Link>
          </div>
        ))}
        {availableTests.length === 0 && (
          <div className="glass-panel" style={{ padding: '24px', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--text-secondary)' }}>You have no new tests available to take.</p>
          </div>
        )}
      </div>

      <h2 style={{ marginBottom: '20px' }}>Completed Tests</h2>
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Test Name</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Score</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Date Completed</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {completedResults.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>{r.test.title}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`badge ${r.score >= 80 ? 'badge-success' : ''}`} style={{ 
                    background: r.score < 80 ? 'rgba(239, 68, 68, 0.2)' : undefined, 
                    color: r.score < 80 ? 'var(--error-color)' : undefined 
                  }}>
                    {r.score}%
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                  {new Date(r.submittedAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px' }}>
                  <Link href={`/employee/results/${r.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    View Result
                  </Link>
                </td>
              </tr>
            ))}
            {completedResults.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  You haven't completed any tests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
