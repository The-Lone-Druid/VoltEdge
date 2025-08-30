import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-utils'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper'

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

  // Check if email is verified (except for master users who may not need verification)
  if (!session.user.emailVerified && session.user.role !== 'MASTER') {
    redirect('/auth/resend-verification')
  }

  return (
    <DashboardWrapper>
      <div className='bg-background flex h-screen overflow-hidden'>
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <DashboardSidebar />

        {/* Main content area */}
        <div className='flex min-w-0 flex-1 flex-col'>
          {/* Header */}
          <DashboardHeader />

          {/* Page content with proper mobile spacing */}
          <main className='bg-background flex-1 overflow-y-auto'>
            <div className='max-w-full p-4 sm:p-6 lg:p-8'>{children}</div>
          </main>
        </div>
      </div>
    </DashboardWrapper>
  )
}
