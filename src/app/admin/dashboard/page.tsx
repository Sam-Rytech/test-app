import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  const totalTestsCount = await prisma.test.count();
  const results = await prisma.result.findMany();
  
  const testsTakenCount = results.length;
  
  const averageScore = testsTakenCount > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / testsTakenCount)
    : 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <span className="badge badge-success">Admin Access</span>
      </div>

      <div className="card-grid" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Tests</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalTestsCount}</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Tests Taken</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{testsTakenCount}</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Average Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{averageScore}%</p>
        </div>
      </div>
      
      <h2>Recent Activity</h2>
      <div className="glass-panel" style={{ marginTop: '20px', padding: '20px' }}>
        {results.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No recent activity to display.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.slice(-5).reverse().map(result => (
              <li key={result.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                Test completed with score: <strong style={{ color: result.score >= 80 ? 'var(--success-color)' : 'var(--error-color)' }}>{result.score}%</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
