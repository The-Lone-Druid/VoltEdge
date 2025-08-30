import { UserManagementDashboard } from '@/components/admin/user-management-dashboard'
import { authOptions } from '@/lib/auth'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

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

  return <UserManagementDashboard />
}
