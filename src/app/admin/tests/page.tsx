import Link from "next/link";
import prisma from "@/lib/prisma";
import DeleteTestButton from "@/components/DeleteTestButton";

export const dynamic = 'force-dynamic';

export default async function ManageTests() {
  const tests = await prisma.test.findMany({
    include: {
      questions: true,
      results: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Manage Tests</h1>
        <Link href="/admin/tests/create" className="btn btn-primary">
          Create New Test
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {tests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>No tests have been created yet.</p>
            <Link href="/admin/tests/create" className="btn btn-primary">
              Create Your First Test
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Title</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Questions</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Completions</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Date Created</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}><strong>{test.title}</strong></td>
                  <td style={{ padding: '16px' }}>{test.questions.length}</td>
                  <td style={{ padding: '16px' }}>{test.results.length}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                    {new Date(test.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/tests/${test.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                      View
                    </Link>
                    <DeleteTestButton testId={test.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
