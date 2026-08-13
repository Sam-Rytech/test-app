import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function ViewResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  
  if (!sessionCookie) return notFound();
  
  const session = JSON.parse(sessionCookie.value);

  const result = await prisma.result.findUnique({
    where: { id },
    include: {
      test: {
        include: {
          questions: true
        }
      }
    }
  });

  if (!result || result.userId !== session.id) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Result Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>This result does not exist or you do not have permission to view it.</p>
        <Link href="/employee/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  // Parse the stored answers object (key is question ID, value is option index)
  let answers: Record<string, number> = {};
  if (result.answers) {
    try {
      answers = JSON.parse(result.answers);
    } catch (e) {
      console.error("Failed to parse answers JSON", e);
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="page-header">
        <div>
          <Link href="/employee/dashboard" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', marginBottom: '8px', display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
          <h1>{result.test.title} - Result Review</h1>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '10px' }}>Your Final Score</h2>
        <span className={`badge ${result.score >= 80 ? 'badge-success' : ''}`} style={{ 
          background: result.score < 80 ? 'rgba(239, 68, 68, 0.2)' : undefined, 
          color: result.score < 80 ? 'var(--error-color)' : undefined,
          fontSize: '3rem',
          padding: '16px 32px',
          display: 'inline-block',
          marginTop: '20px'
        }}>
          {result.score}%
        </span>
        <p style={{ color: 'var(--text-secondary)', marginTop: '20px' }}>
          Completed on {new Date(result.submittedAt).toLocaleDateString()} at {new Date(result.submittedAt).toLocaleTimeString()}
        </p>
      </div>

      <h2>Question Breakdown</h2>
      
      {result.test.questions.map((q, index) => {
        const options = JSON.parse(q.options);
        const selectedOptionIndex = answers[q.id];
        
        return (
          <div key={q.id} className="glass-panel" style={{ padding: '30px', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>{index + 1}. {q.text}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {options.map((opt: string, optIndex: number) => {
                const isSelected = selectedOptionIndex === optIndex;
                const isCorrect = q.correctAnswerIndex === optIndex;
                const isWrongSelection = isSelected && !isCorrect;

                let backgroundColor = 'rgba(15, 23, 42, 0.4)';
                let borderColor = 'var(--border-color)';
                let textColor = 'inherit';

                if (isCorrect) {
                  backgroundColor = 'rgba(16, 185, 129, 0.1)';
                  borderColor = 'var(--success-color)';
                  textColor = 'var(--success-color)';
                } else if (isWrongSelection) {
                  backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  borderColor = 'var(--error-color)';
                  textColor = 'var(--error-color)';
                } else if (isSelected) {
                  // Fallback if there is a weird state, but normally if isSelected it's either correct or wrong
                  borderColor = 'var(--primary-color)';
                }

                return (
                  <div key={optIndex} style={{ 
                    padding: '16px', 
                    background: backgroundColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? (isCorrect ? 'var(--success-color)' : 'var(--error-color)') : 'var(--text-secondary)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isSelected ? (isCorrect ? 'var(--success-color)' : 'var(--error-color)') : 'transparent'
                    }}>
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <span>{opt}</span>
                    {isCorrect && <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>✓ Correct Answer</span>}
                    {isWrongSelection && <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>✗ Your Answer</span>}
                  </div>
                );
              })}
            </div>
            
            {selectedOptionIndex === undefined && (
              <p style={{ marginTop: '16px', color: 'var(--error-color)' }}>
                <em>You did not answer this question.</em>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
