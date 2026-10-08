import type { IconName } from "@/types/ui";

export const navigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Aliens", href: "/aliens", icon: "alien" },
  { label: "Omnitrix", href: "/omnitrix", icon: "omnitrix" },
  { label: "Battles", href: "/battles", icon: "swords" },
  { label: "Achievements", href: "/achievements", icon: "trophy" },
  { label: "Rankings", href: "/rankings", icon: "ranking" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Notifications", href: "/notifications", icon: "bell" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export function getActiveNavigationItem(pathname: string) {
  return navigation.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}
