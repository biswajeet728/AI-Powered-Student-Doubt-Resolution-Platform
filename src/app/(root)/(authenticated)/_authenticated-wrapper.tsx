"use client";

import { UserProvider } from "@/lib/providers/user-context";

interface AuthenticatedWrapperProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string | null;
  };
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function AuthenticatedWrapper({
  initialUser,
  header,
  footer,
  children,
  modal,
}: AuthenticatedWrapperProps) {
  return (
    <UserProvider initialUser={initialUser}>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
      {modal}
    </UserProvider>
  );
}
