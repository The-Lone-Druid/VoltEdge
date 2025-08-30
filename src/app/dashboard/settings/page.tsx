import { ProfileSettingsForm } from '@/components/profile/profile-settings-form'
import { PageHeader } from '../../../components/dashboard/page-header'

export default function ProfileSettingsPage() {
  return (
    <div className='container mx-auto space-y-6'>
      <PageHeader
        title={'Profile Settings'}
        subtitle={'Manage your account settings and preferences.'}
      />
      <ProfileSettingsForm />
    </div>
  )
}
