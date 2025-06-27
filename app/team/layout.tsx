import DashboardLayout from '../dashboard/layout'

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
} 