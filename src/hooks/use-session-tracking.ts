'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useSessionTracking() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      // Track the session when user is authenticated
      const trackSession = async () => {
        try {
          // Get or create a session identifier for this browser
          let sessionIdentifier = localStorage.getItem('voltedge-session-id')
          if (!sessionIdentifier) {
            sessionIdentifier = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
            localStorage.setItem('voltedge-session-id', sessionIdentifier)
          }

          await fetch('/api/user/sessions/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userAgent: navigator.userAgent,
              ipAddress: null, // Will be determined server-side
              sessionIdentifier,
            }),
          })
        } catch (error) {
          console.error('Failed to track session:', error)
        }
      }

      trackSession()
    }
  }, [session?.user?.id])
}
