"use client";

import { usePathname } from "next/navigation";
import { getActiveNavigationItem } from "@/components/dashboard/navigation";

export default function DashboardBreadcrumb() {
  const pathname = usePathname();
  const activeItem = getActiveNavigationItem(pathname);

  return (
    <div className="breadcrumb">
      Workspace <span aria-hidden="true">/</span>{" "}
      <strong>{activeItem?.label ?? "Dashboard"}</strong>
    </div>
  );
}
