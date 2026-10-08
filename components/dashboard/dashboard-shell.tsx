import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardBreadcrumb from "@/components/dashboard/dashboard-breadcrumb";
import Icon from "@/components/ui/icon";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="dashboard-shell">
      <DashboardSidebar />
      <main className="dashboard-main">
        <header className="topbar">
          <DashboardBreadcrumb />
          <div className="topbar-actions">
            <label className="search-box">
              <Icon name="search" />
              <input aria-label="Search workspace" placeholder="Search anything..." />
            </label>
            <button className="icon-button" type="button" aria-label="Notifications">
              <Icon name="bell" />
            </button>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
