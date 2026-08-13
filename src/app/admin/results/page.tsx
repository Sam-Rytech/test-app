import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminResults() {
  const results = await prisma.result.findMany({
    include: {
      user: true,
      test: true,
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Employee Results</h1>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Employee</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Test Name</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Score</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>{r.user?.name || 'Unknown User'}</td>
                <td style={{ padding: '16px' }}>{r.test?.title || 'Unknown Test'}</td>
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
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No results yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
