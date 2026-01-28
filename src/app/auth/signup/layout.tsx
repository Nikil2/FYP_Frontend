import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Mehnati",
  description: "Create your Mehnati account",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
