'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  FileText,
  Package,
  Settings,
  BarChart3,
  Zap,
  UserPlus,
  Shield,
  Battery,
  DollarSign,
  Globe,
  Activity,
  Wrench,
  Calculator,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

const navigationItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'GST Calculator',
    href: '/dashboard/calculators/gst',
    icon: DollarSign,
    badge: 'New',
  },
  {
    title: 'Pricing Calculator',
    href: '/dashboard/calculators/pricing',
    icon: Calculator,
    badge: 'New',
  },
  {
    title: 'Battery Calculator',
    href: '/dashboard/battery-calculator',
    icon: Battery,
    badge: 'New',
  },
  {
    title: 'Quotations',
    href: '/dashboard/quotations',
    icon: FileText,
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
]

const businessItems = [
  {
    title: 'Landing Page',
    href: '/dashboard/landing-page',
    icon: Globe,
  },
  {
    title: 'Warranties',
    href: '/dashboard/warranties',
    icon: Shield,
  },
]

const adminItems = [
  {
    title: 'User Management',
    href: '/dashboard/admin/users',
    icon: UserPlus,
  },
  {
    title: 'Activity Logs',
    href: '/dashboard/admin/activities',
    icon: Activity,
  },
  {
    title: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: Wrench,
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleLinkClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Logo */}
      <div className='flex h-16 items-center px-6'>
        <div className='flex items-center space-x-2'>
          <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
            <Zap className='text-primary-foreground h-5 w-5' />
          </div>
          <span className='text-xl font-bold'>VoltEdge</span>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className='flex-1 space-y-1 overflow-y-auto px-3 py-4'>
        {/* Main Navigation */}
        <div className='space-y-1'>
          {navigationItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className='h-5 w-5 flex-shrink-0' />
                <span className='flex-1 truncate'>{item.title}</span>
                {item.badge && (
                  <Badge
                    variant='secondary'
                    className='ml-auto flex-shrink-0 text-xs'
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>

        <Separator className='my-4' />

        {/* Business Features for Dealers */}
        {session?.user?.role === 'DEALER' && (
          <>
            <div className='space-y-1'>
              <h3 className='text-muted-foreground px-3 text-xs font-semibold tracking-wider uppercase'>
                Business Tools
              </h3>
              {businessItems.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className='h-5 w-5 flex-shrink-0' />
                    <span className='truncate'>{item.title}</span>
                  </Link>
                )
              })}
            </div>
            <Separator className='my-4' />
          </>
        )}

        {/* Admin Section for Master Users */}
        {session?.user?.role === 'MASTER' && (
          <div className='space-y-1'>
            <h3 className='text-muted-foreground px-3 text-xs font-semibold tracking-wider uppercase'>
              Administration
            </h3>
            {adminItems.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className='h-5 w-5 flex-shrink-0' />
                  <span className='truncate'>{item.title}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Settings at bottom */}
      <div className='border-t px-3 py-4'>
        <Link
          href='/dashboard/settings'
          onClick={handleLinkClick}
          className={cn(
            'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/dashboard/settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className='h-5 w-5 flex-shrink-0' />
          <span className='truncate'>Settings</span>
        </Link>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar when route changes on mobile
  const pathname = usePathname()
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Export the toggle function for use by the header
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(
        window as typeof window & { toggleSidebar?: () => void }
      ).toggleSidebar = () => setIsOpen(!isOpen)
    }
  }, [isOpen])

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side='left' className='w-80 p-0'>
          <div className='bg-background h-full'>
            <SidebarContent onClose={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className='bg-background hidden h-full w-64 flex-col border-r shadow-sm lg:flex'>
      <SidebarContent />
    </div>
  )
}
