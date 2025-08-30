import { getSession } from '@/lib/auth-utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileText, Package, Users, Calculator, TrendingUp } from 'lucide-react'
import { PageHeader } from '../../components/dashboard/page-header'

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <PageHeader
        title={`Welcome back! ${session?.user?.firstName ?? ''}`}
        subtitle="Here's what's happening with your electrical business today."
      />

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Quotations
            </CardTitle>
            <FileText className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-muted-foreground text-xs'>+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Products
            </CardTitle>
            <Package className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-muted-foreground text-xs'>+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Customers</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>89</div>
            <p className='text-muted-foreground text-xs'>+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Revenue</CardTitle>
            <TrendingUp className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>₹2,45,000</div>
            <p className='text-muted-foreground text-xs'>
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Recent Activity and Quick Actions */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Recent Quotations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotations</CardTitle>
            <CardDescription>
              Your latest quotation requests and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[1, 2, 3].map(item => (
                <div key={item} className='flex items-center space-x-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText className='h-5 w-5' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <p className='text-sm font-medium'>
                      Quote #QT-{2024000 + item}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Battery backup system for Office Complex
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>₹45,000</p>
                    <p className='text-muted-foreground text-xs'>2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <div className='hover:bg-accent flex cursor-pointer items-center space-x-4 rounded-lg border p-4'>
                <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                  <FileText className='text-primary-foreground h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Create New Quotation</p>
                  <p className='text-muted-foreground text-xs'>
                    Generate a professional quote
                  </p>
                </div>
              </div>

              <div className='hover:bg-accent flex cursor-pointer items-center space-x-4 rounded-lg border p-4'>
                <div className='bg-secondary flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Calculator className='text-secondary-foreground h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Battery Calculator</p>
                  <p className='text-muted-foreground text-xs'>
                    Calculate backup time and requirements
                  </p>
                </div>
              </div>

              <div className='hover:bg-accent flex cursor-pointer items-center space-x-4 rounded-lg border p-4'>
                <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Package className='text-muted-foreground h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Manage Products</p>
                  <p className='text-muted-foreground text-xs'>
                    Add or update battery specifications
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
