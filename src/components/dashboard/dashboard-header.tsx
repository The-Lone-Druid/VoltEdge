'use client'

import { useSession, signOut } from 'next-auth/react'
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function DashboardHeader() {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <header className='bg-background h-16 border-b'>
      <div className='flex h-full items-center justify-between px-6'>
        {/* Left side - Search */}
        <div className='flex items-center space-x-4'>
          <div className='relative w-96'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search quotations, products, customers...'
              className='pl-10'
            />
          </div>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className='flex items-center space-x-4'>
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
              <DropdownMenuItem>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
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
