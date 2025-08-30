'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Monitor,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { AnimatedThemeToggler } from '../magicui/animated-theme-toggler'

export function DashboardHeader() {
  const { data: session } = useSession()
  const isMobile = useIsMobile()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  const handleMenuToggle = () => {
    if (typeof window !== 'undefined') {
      const windowWithToggle = window as typeof window & {
        toggleSidebar?: () => void
      }
      if (windowWithToggle.toggleSidebar) {
        windowWithToggle.toggleSidebar()
      }
    }
  }

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <header className='bg-background h-16 border-b'>
      <div className='flex h-full items-center justify-between px-4 sm:px-6'>
        {/* Left side - Mobile menu + Search */}
        <div className='flex flex-1 items-center space-x-2 sm:space-x-4'>
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleMenuToggle}
              className='lg:hidden'
            >
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          )}

          {/* Search */}
          <div className='relative max-w-sm flex-1 sm:max-w-md lg:max-w-lg'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder={
                isMobile
                  ? 'Search...'
                  : 'Search quotations, products, customers...'
              }
              className='pl-10 text-sm'
            />
          </div>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className='flex items-center space-x-2 sm:space-x-4'>
          {/* Notifications */}
          <Button variant='ghost' size='sm' className='relative'>
            <Bell className='h-5 w-5' />
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs'
            >
              3
            </Badge>
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='flex items-center space-x-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage
                    src=''
                    alt={
                      `${session?.user?.firstName} ${session?.user?.lastName}` ||
                      ''
                    }
                  />
                  <AvatarFallback className='text-sm'>
                    {getInitials(
                      session?.user?.firstName,
                      session?.user?.lastName
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className='hidden text-left sm:block'>
                  <p className='text-sm font-medium'>
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className='text-muted-foreground text-xs capitalize'>
                    {session?.user?.role?.toLowerCase()}
                  </p>
                </div>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className='text-muted-foreground text-xs leading-none'>
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/settings'
                  className='flex w-full items-center'
                >
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/settings'
                  className='flex w-full items-center'
                >
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/settings?tab=sessions'
                  className='flex w-full items-center'
                >
                  <Monitor className='mr-2 h-4 w-4' />
                  <span>Active Sessions</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AnimatedThemeToggler className='flex w-full items-center gap-2'>
                  <span>Change Theme</span>
                </AnimatedThemeToggler>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
