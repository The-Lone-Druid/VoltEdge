'use client'

import { useSessionTracking } from '@/hooks/use-session-tracking'

interface DashboardWrapperProps {
  children: React.ReactNode
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  useSessionTracking()

  return <>{children}</>
}
