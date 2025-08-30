import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-utils'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className='bg-background flex h-screen'>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <DashboardHeader />

        {/* Page content */}
        <main className='bg-background flex-1 overflow-x-hidden overflow-y-auto p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}
