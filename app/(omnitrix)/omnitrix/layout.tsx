import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function OmnitrixLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}