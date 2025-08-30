import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Zap, Battery, Calculator, FileText } from 'lucide-react'

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <header className='border-b bg-white/80 backdrop-blur-sm'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center space-x-2'>
            <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
              <Zap className='text-primary-foreground h-5 w-5' />
            </div>
            <span className='text-xl font-bold'>VoltEdge</span>
          </div>
          <div className='space-x-2'>
            <Button variant='ghost' asChild>
              <Link href='/auth/signin'>Sign In</Link>
            </Button>
            <Button asChild>
              <Link href='/auth/signin'>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
            Power Your Electrical Business with{' '}
            <span className='text-primary'>VoltEdge</span>
          </h1>
          <p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8'>
            Complete B2B SaaS solution for electrical dealers. Generate
            professional quotations, calculate battery backup times, track
            warranties, and manage GST calculations - all in one platform.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button size='lg' asChild>
              <Link href='/auth/signin'>Start Free Trial</Link>
            </Button>
            <Button variant='outline' size='lg'>
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className='mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader>
              <FileText className='text-primary h-10 w-10' />
              <CardTitle>Professional Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate branded quotations with product specifications,
                pricing, and GST calculations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calculator className='text-primary h-10 w-10' />
              <CardTitle>Battery Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Calculate backup times for Lead Acid, SMF, and Lithium batteries
                with precision.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Battery className='text-primary h-10 w-10' />
              <CardTitle>Warranty Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track battery warranties, replacement schedules, and maintenance
                reminders.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className='text-primary h-10 w-10' />
              <CardTitle>GST Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated GST calculations for B2B and B2C transactions with
                compliance features.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
