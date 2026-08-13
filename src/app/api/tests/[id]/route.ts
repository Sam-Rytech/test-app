import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Next.js 15+ sometimes requires awaiting params, but we are on Next 14. We can safely destructure. Wait, Next.js 15 requires awaiting params. The package.json says Next 16.3.0, so yes, await params!
    
    if (!id) {
      return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
    }

    await prisma.test.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting test:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
