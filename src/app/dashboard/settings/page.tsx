import { Suspense } from 'react'
import { ProfileSettingsForm } from '@/components/profile/profile-settings-form'

export default function ProfileSettingsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Profile Settings</h1>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProfileSettingsForm />
      </Suspense>
    </div>
  )
}
