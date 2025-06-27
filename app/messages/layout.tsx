import DashboardLayout from '../dashboard/layout'

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
} 