import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary-background px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
