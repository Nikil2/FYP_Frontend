import { Suspense } from "react";

import { CustomerSignupForm } from "@/components/auth/CustomerSignupForm";

export default function CustomerSignupPage() {
  return (
    <main className="min-h-screen section-padding-standard flex-center bg-secondary-background px-4 pt-24 ">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full" />
          </div>
        }
      >
        <CustomerSignupForm />
      </Suspense>
    </main>
  );
}
