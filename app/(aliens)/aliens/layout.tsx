import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function AliensLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}