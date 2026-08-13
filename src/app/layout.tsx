import type { Metadata } from "next";
import { cookies } from "next/headers";
import GlobalNav from "@/components/GlobalNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Management Software",
  description: "A comprehensive platform to manage and take tests.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  const session = sessionCookie ? JSON.parse(sessionCookie.value) : null;

  return (
    <html lang="en">
      <body>
        <GlobalNav session={session} />
        {children}
      </body>
    </html>
  );
}
