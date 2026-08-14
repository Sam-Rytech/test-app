import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, password, name } = body;
    const email = body.email ? body.email.trim() : "";
    const cookieStore = await cookies();

    if (role === "ADMIN") {
      let adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      
      // Seed default admin if not exists
      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: {
            name: "Admin User",
            email: "admin@Pavictek.com",
            password: "admin123",
            role: "ADMIN"
          }
        });
      }

      if (email === adminUser.email && password === adminUser.password) {
        cookieStore.set('auth_session', JSON.stringify({ id: adminUser.id, role: "ADMIN", name: adminUser.name }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        return NextResponse.json({ success: true, role: "ADMIN" });
      }
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    if (role === "EMPLOYEE") {
      if (!email || !name) {
        return NextResponse.json({ error: "Name and Work Email are required" }, { status: 400 });
      }

      // Upsert the employee in the database so we have a record for their test results
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            password: "",
            role: "EMPLOYEE"
          }
        });
      } else if (user.role === "ADMIN") {
        return NextResponse.json({ error: "Cannot login as employee with an admin email" }, { status: 403 });
      }

      cookieStore.set('auth_session', JSON.stringify({ id: user.id, role: "EMPLOYEE", name: user.name }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      return NextResponse.json({ success: true, role: "EMPLOYEE" });
    }

    return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');

  if (session) {
    return NextResponse.json({ user: JSON.parse(session.value) });
  }

  return NextResponse.json({ user: null }, { status: 401 });
}
