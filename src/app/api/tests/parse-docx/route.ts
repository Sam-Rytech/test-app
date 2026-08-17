import { NextResponse } from 'next/server';
import * as mammoth from 'mammoth';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    // Parse the text into questions
    const parsedQuestions = parseQuestionsText(text);

    return NextResponse.json({ questions: parsedQuestions });
  } catch (error) {
    console.error("Error parsing docx:", error);
    return NextResponse.json({ error: "Failed to parse DOCX file" }, { status: 500 });
  }
}

function parseQuestionsText(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const questions: any[] = [];
  let currentQuestion: any = null;

  for (const line of lines) {
    // Check if line is a question (starts with number and dot, e.g. "1. ")
    if (/^\d+\./.test(line)) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        text: line.replace(/^\d+\.\s*/, '').trim(),
        options: [],
        correctAnswerIndex: 0
      };
    } 
    // Check if line is an option (e.g. "A) ", "*B) ")
    else if (/^\*?[A-Za-z][\.\)]\s/.test(line)) {
      if (currentQuestion) {
        const isCorrect = line.startsWith('*');
        const optionText = line.replace(/^\*?[A-Za-z][\.\)]\s*/, '').trim();
        
        if (isCorrect) {
          currentQuestion.correctAnswerIndex = currentQuestion.options.length;
        }
        currentQuestion.options.push(optionText);
      }
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}
