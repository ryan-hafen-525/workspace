import {
  LayoutDashboard,
  Upload,
  Receipt,
  BarChart3,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description?: string
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview of your receipts and spending",
  },
  {
    title: "Upload Receipt",
    href: "/upload",
    icon: Upload,
    description: "Upload and process receipt images",
  },
  {
    title: "All Receipts",
    href: "/receipts",
    icon: Receipt,
    description: "View and manage all your receipts",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Spending insights and visualizations",
  },
  {
    title: "Budget",
    href: "/budget",
    icon: Wallet,
    description: "Manage category budgets and limits",
  },
]

export const settingsNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configure app settings and preferences",
  },
]
