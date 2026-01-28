import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Mehnati",
  description: "Sign in to your Mehnati account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
