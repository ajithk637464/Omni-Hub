import Link from "next/link";
import Brand from "@/components/ui/brand";
import Icon from "@/components/ui/icon";
import type { IconName } from "@/types/ui";

const navigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Aliens", href: "/aliens", icon: "briefcase" },
  { label: "Omnitrix", href: "/omnitrix", icon: "users" },
  { label: "Battles", href: "/battles", icon: "chart" },
  { label: "Achievements", href: "/achievements", icon: "chart" },
  { label: "Rankings", href: "/rankings", icon: "chart" },
  { label: "History", href: "/history", icon: "chart" },
  { label: "Notifications", href: "/notifications", icon: "chart" },
  { label: "Settings", href: "/settings", icon: "chart" },
];

export default function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">
      <Brand />

      <p className="nav-label">Workspace</p>
      <nav className="sidebar-nav" aria-label="Workspace navigation">
        {navigation.map((item, index) => (
          <Link
            className={`nav-link${index === 0 ? " active" : ""}`}
            href={item.href}
            key={item.label}
            aria-current={index === 0 ? "page" : undefined}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
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
