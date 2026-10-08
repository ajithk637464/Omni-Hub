import type { IconName } from "@/types/ui";

export const stats: {
  label: string;
  value: string;
  trend: string;
  comparison: string;
  color: string;
  icon: IconName;
}[] = [
  {
    label: "Total revenue",
    value: "$48,294",
    trend: "+12.8%",
    comparison: "from last month",
    color: "",
    icon: "chart",
  },
  {
    label: "Active customers",
    value: "2,840",
    trend: "+8.2%",
    comparison: "from last month",
    color: "green",
    icon: "users",
  },
  {
    label: "Active projects",
    value: "24",
    trend: "+4.3%",
    comparison: "from last month",
    color: "orange",
    icon: "briefcase",
  },
  {
    label: "Avg. order value",
    value: "$169.35",
    trend: "-2.1%",
    comparison: "from last month",
    color: "blue",
    icon: "chart",
  },
];

export const monthlyRevenue = [
  { label: "Jan", value: 38 },
  { label: "Feb", value: 53 },
  { label: "Mar", value: 46 },
  { label: "Apr", value: 67 },
  { label: "May", value: 56 },
  { label: "Jun", value: 80 },
  { label: "Jul", value: 63 },
  { label: "Aug", value: 92, current: true },
  { label: "Sep", value: 70 },
  { label: "Oct", value: 84 },
  { label: "Nov", value: 59 },
  { label: "Dec", value: 75 },
];

export const projects = [
  { initials: "WB", name: "Website redesign", detail: "Design · 8 members", progress: 78 },
  { initials: "MP", name: "Mobile application", detail: "Product · 6 members", progress: 54 },
  { initials: "BC", name: "Brand refresh", detail: "Marketing · 4 members", progress: 32 },
];

export const activity = [
  {
    initials: "JL",
    avatarColor: "avatar-blue",
    name: "Jordan Lee",
    date: "Oct 08, 2026",
    amount: "$1,240.00",
    status: "Paid",
    invoice: "INV-2026-084",
  },
  {
    initials: "SC",
    avatarColor: "avatar-green",
    name: "Sam Carter",
    date: "Oct 07, 2026",
    amount: "$860.00",
    status: "Paid",
    invoice: "INV-2026-083",
  },
  {
    initials: "RD",
    avatarColor: "avatar-purple",
    name: "Riley Dawson",
    date: "Oct 07, 2026",
    amount: "$2,450.00",
    status: "Pending",
    invoice: "INV-2026-082",
  },
];
