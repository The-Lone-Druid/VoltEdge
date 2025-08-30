import { Metadata } from 'next'
import { AccountSetupForm } from '@/components/auth/account-setup-form'

export const metadata: Metadata = {
  title: 'Set Up Your Account | VoltEdge',
  description: 'Complete your account setup',
}

export default function AccountSetupPage() {
  return <AccountSetupForm />
}
