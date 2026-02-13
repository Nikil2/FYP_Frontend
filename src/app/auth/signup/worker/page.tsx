import { WorkerSignupForm } from "@/components/auth/worker-signup/WorkerSignupWizard";

export default function WorkerSignupPage() {
  return (
    <main className="min-h-screen flex-center bg-secondary-background px-4 py-8 pt-24">
      <WorkerSignupForm />
    </main>
  );
}
