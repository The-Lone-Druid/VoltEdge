import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserManagementDashboard } from '@/components/admin/user-management-dashboard'

export const metadata: Metadata = {
  title: 'User Management | VoltEdge',
  description: 'Manage users, invitations, and permissions',
}

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions)

  // Only Master users can access user management
  if (!session || session.user.role !== 'MASTER') {
    redirect('/dashboard')
  }

  return (
    <div className='container mx-auto py-6'>
      <UserManagementDashboard />
    </div>
  )
}
