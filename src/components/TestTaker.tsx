"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TestTaker({ test }: { test: any }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answersRef = useRef(answers);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    // Shuffle questions on mount
    const shuffled = [...test.questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);

    // Initialize timer
    if (test.timeLimit) {
      setTimeLeft(test.timeLimit * 60);
    }
  }, [test]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAutoSubmit = async () => {
    if (submitted) return;
    await submitTest(answersRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (qId: string, oIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: oIndex });
  };

  const handleSubmit = async () => {
    await submitTest(answers);
  };

  const submitTest = async (currentAnswers: Record<string, number>) => {
    setLoading(true);
    setError("");

    let correct = 0;
    test.questions.forEach((q: any) => {
      if (currentAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / test.questions.length) * 100);
    setScore(finalScore);

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: test.id, score: finalScore, answers: currentAnswers })
      });

      if (!res.ok) {
        throw new Error("Failed to save result");
      }

      setSubmitted(true);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError("Failed to save your test result. Please try submitting again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="page-header">
        <h1>{test.title}</h1>
        {submitted && <span className={`badge ${score >= 80 ? 'badge-success' : ''}`} style={{ 
          background: score < 80 ? 'rgba(239, 68, 68, 0.2)' : undefined, 
          color: score < 80 ? 'var(--error-color)' : undefined,
          fontSize: '1.2rem',
          padding: '8px 16px'
        }}>
          Score: {score}%
        </span>}
        {!submitted && timeLeft !== null && (
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: timeLeft < 60 ? 'var(--error-color)' : 'var(--text-primary)',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px 16px',
            borderRadius: '8px'
          }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {!submitted ? (
        <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>
          Please answer all questions below. You cannot change your answers after submission.
        </p>
      ) : (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', textAlign: 'center' }}>
          <h2>Test Completed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Your results have been saved securely.</p>
          <Link href="/employee/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Return to Dashboard
          </Link>
        </div>
      )}

      {error && (
        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.2)', color: 'var(--error-color)', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {shuffledQuestions.map((q: any, qIndex: number) => {
        const options = JSON.parse(q.options);
        return (
          <div key={q.id} className="glass-panel" style={{ padding: '30px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>{qIndex + 1}. {q.text}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {options.map((opt: string, oIndex: number) => {
                const isSelected = answers[q.id] === oIndex;
                const isCorrect = submitted && q.correctAnswerIndex === oIndex;
                const isWrongSelection = submitted && isSelected && !isCorrect;

                let backgroundColor = 'rgba(15, 23, 42, 0.6)';
                let borderColor = 'var(--border-color)';

                if (isSelected) {
                  borderColor = 'var(--primary-color)';
                  backgroundColor = 'var(--primary-light)';
                }

                if (submitted) {
                  if (isCorrect) {
                    backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    borderColor = 'var(--success-color)';
                  } else if (isWrongSelection) {
                    backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    borderColor = 'var(--error-color)';
                  }
                }

                return (
                  <div 
                    key={oIndex}
                    onClick={() => handleOptionSelect(q.id, oIndex)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      background: backgroundColor,
                      cursor: submitted ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--text-secondary)'}`,
                      background: isSelected ? 'var(--primary-color)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <span>{opt}</span>
                    {submitted && isCorrect && <span style={{ marginLeft: 'auto', color: 'var(--success-color)' }}>✓ Correct</span>}
                    {submitted && isWrongSelection && <span style={{ marginLeft: 'auto', color: 'var(--error-color)' }}>✗ Incorrect</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== test.questions.length || loading}
        >
          {loading ? "Submitting..." : "Submit Test"}
        </button>
      )}
    </div>
  );
}
