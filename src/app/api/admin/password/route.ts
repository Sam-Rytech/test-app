import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
    const adminUser = await prisma.user.findUnique({ where: { id: session.id } });
    
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    
    if (adminUser.password !== currentPassword) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }
    
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: newPassword }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
