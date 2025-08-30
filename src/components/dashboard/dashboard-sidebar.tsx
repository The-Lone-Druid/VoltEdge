'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
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

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className='bg-background flex h-full w-64 flex-col border-r shadow-sm'>
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
      <nav className='flex-1 space-y-1 px-3 py-4'>
        {/* Main Navigation */}
        {navigationItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className='h-5 w-5' />
              <span className='flex-1'>{item.title}</span>
              {item.badge && (
                <Badge variant='secondary' className='ml-auto text-xs'>
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

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
                    className={cn(
                      'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className='h-5 w-5' />
                    <span>{item.title}</span>
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
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className='h-5 w-5' />
                  <span>{item.title}</span>
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
          className={cn(
            'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/dashboard/settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className='h-5 w-5' />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
}
