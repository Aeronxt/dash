import DashboardLayout from '../dashboard/layout'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
} 