import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ActivityLogsView } from '@/components/admin/activity-logs-view'
import { PageHeader } from '../../../../components/dashboard/page-header'

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
      <PageHeader
        title={'Activity Logs'}
        subtitle={
          'Monitor system activity and user actions across the platform'
        }
      />

      <ActivityLogsView />
    </div>
  )
}
