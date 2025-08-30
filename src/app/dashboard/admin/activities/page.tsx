import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ActivityLogsView } from '@/components/admin/activity-logs-view'

export const metadata: Metadata = {
  title: 'Activity Logs | VoltEdge',
  description: 'View system activity logs and user actions',
}

export default async function ActivityLogsPage() {
  const session = await getServerSession(authOptions)

  // Only Master users can access activity logs
  if (!session || session.user.role !== 'MASTER') {
    redirect('/dashboard')
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Activity Logs</h1>
        <p className='text-muted-foreground'>
          Monitor system activity and user actions across the platform
        </p>
      </div>
      <ActivityLogsView />
    </div>
  )
}
