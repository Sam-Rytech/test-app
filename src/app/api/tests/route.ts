import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { title, description, timeLimit, questions } = await request.json();

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ error: "Title and at least one question are required" }, { status: 400 });
    }

    const newTest = await prisma.test.create({
      data: {
        title,
        description,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswerIndex: q.correctAnswerIndex
          }))
        }
      }
    });

    return NextResponse.json({ success: true, test: newTest });
  } catch (error) {
    console.error("Error creating test:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
