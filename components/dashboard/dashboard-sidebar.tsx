"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/ui/brand";
import Icon from "@/components/ui/icon";
import {
  getActiveNavigationItem,
  navigation,
} from "@/components/dashboard/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const activeItem = getActiveNavigationItem(pathname);

  return (
    <aside className="dashboard-sidebar">
      <Brand />

      <p className="nav-label">Workspace</p>
      <nav className="sidebar-nav" aria-label="Workspace navigation">
        {navigation.map((item) => {
          const isActive = activeItem === item;

          return (
            <Link
              className={`nav-link${isActive ? " active" : ""}`}
              href={item.href}
              key={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <span className="user-avatar">AK</span>
          <div className="sidebar-user-copy">
            <strong>Ajith Kumaravel</strong>
            <span>Workspace admin</span>
          </div>
          <Icon name="more" />
        </div>
      </div>
    </aside>
  );
}
