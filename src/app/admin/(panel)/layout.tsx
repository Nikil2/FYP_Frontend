import { AdminShell } from "@/components/admin/AdminShell";

interface AdminPanelLayoutProps {
  children: React.ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
