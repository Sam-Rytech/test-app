import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { testId, score, answers } = await request.json();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    if (session.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Only employees can submit tests" }, { status: 403 });
    }

    if (!testId || score === undefined) {
      return NextResponse.json({ error: "Missing testId or score" }, { status: 400 });
    }

    // Save the result
    const result = await prisma.result.create({
      data: {
        userId: session.id,
        testId: testId,
        score: score,
        answers: answers ? JSON.stringify(answers) : null
      }
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving result:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
