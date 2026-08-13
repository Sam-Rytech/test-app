import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ViewTest({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      questions: true
    }
  });

  if (!test) {
    notFound();
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div className="page-header">
        <div>
          <Link href="/admin/tests" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', marginBottom: '8px', display: 'inline-block' }}>
            ← Back to Tests
          </Link>
          <h1>{test.title}</h1>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2>Test Details</h2>
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: 'var(--text-secondary)' }}><strong>Description:</strong> {test.description || "No description provided."}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}><strong>Created On:</strong> {new Date(test.createdAt).toLocaleDateString()}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}><strong>Total Questions:</strong> {test.questions.length}</p>
        </div>
      </div>

      <h2>Questions Overview</h2>
      
      {test.questions.map((q, index) => {
        const options = JSON.parse(q.options);
        return (
          <div key={q.id} className="glass-panel" style={{ padding: '30px', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>{index + 1}. {q.text}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '20px' }}>
              {options.map((opt: string, optIndex: number) => {
                const isCorrect = q.correctAnswerIndex === optIndex;
                return (
                  <div key={optIndex} style={{ 
                    padding: '12px', 
                    background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                    border: `1px solid ${isCorrect ? 'var(--success-color)' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    color: isCorrect ? 'var(--success-color)' : 'inherit'
                  }}>
                    {optIndex + 1}. {opt} {isCorrect && " (Correct Answer)"}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
