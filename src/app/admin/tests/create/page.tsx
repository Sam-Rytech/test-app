"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTest() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", ""], correctAnswerIndex: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", ""], correctAnswerIndex: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      if (newQuestions[qIndex].correctAnswerIndex >= newQuestions[qIndex].options.length) {
        newQuestions[qIndex].correctAnswerIndex = 0;
      }
      setQuestions(newQuestions);
    }
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(qIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const handleSaveTest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, questions })
      });
      
      if (!res.ok) {
        throw new Error("Failed to save test");
      }
      
      router.push("/admin/tests");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error saving test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div className="page-header">
        <h1>Create New Test</h1>
        <button onClick={handleSaveTest} className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Test"}
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2>Test Details</h2>
        <div className="form-group" style={{ marginTop: '20px' }}>
          <label>Test Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Q3 Security Compliance Test" 
            required
          />
        </div>
        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Briefly describe what this test covers."
            rows={3}
          />
        </div>
      </div>

      <h2>Questions</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Add questions and select the correct option.</p>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="glass-panel" style={{ padding: '30px', marginBottom: '20px', position: 'relative' }}>
          {questions.length > 1 && (
            <button 
              onClick={() => handleRemoveQuestion(qIndex)}
              className="btn btn-danger"
              style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px 16px' }}>
              Remove
            </button>
          )}
          <div className="form-group">
            <label>Question {qIndex + 1}</label>
            <input 
              type="text" 
              value={q.text} 
              onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} 
              placeholder="What is the main goal of...?"
              required
            />
          </div>

          <div style={{ marginTop: '20px', marginLeft: '20px' }}>
            <label>Options (Select the correct one via radio button)</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="radio" 
                  name={`correct-${qIndex}`} 
                  checked={q.correctAnswerIndex === oIndex}
                  onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', oIndex)}
                  style={{ width: 'auto' }}
                />
                <input 
                  type="text" 
                  value={opt} 
                  onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} 
                  placeholder={`Option ${oIndex + 1}`}
                  required
                />
                {q.options.length > 2 && (
                  <button type="button" onClick={() => handleRemoveOption(qIndex, oIndex)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => handleAddOption(qIndex)} className="btn btn-secondary" style={{ marginTop: '10px', padding: '8px 16px', fontSize: '0.9rem' }}>
              + Add Option
            </button>
          </div>
        </div>
      ))}

      <button onClick={handleAddQuestion} className="btn btn-secondary" style={{ width: '100%', padding: '20px', borderStyle: 'dashed' }}>
        + Add Another Question
      </button>
    </div>
  );
}
