import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TestTaker from "@/components/TestTaker";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TakeTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      questions: true
    }
  });

  if (!test) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Test Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>This test does not exist or has been removed.</p>
        <Link href="/employee/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  if (test.questions.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Empty Test</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>This test has no questions yet.</p>
        <Link href="/employee/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return <TestTaker test={test} />;
}
