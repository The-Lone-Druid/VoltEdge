import { Suspense } from 'react'
import { EmailVerificationForm } from '@/components/auth/email-verification-form'

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationForm />
    </Suspense>
  )
}
