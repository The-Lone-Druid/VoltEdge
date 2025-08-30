import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getSession } from '@/lib/auth-utils'
import { Calculator, FileText, Package, TrendingUp, Users } from 'lucide-react'
import { PageHeader } from '../../components/dashboard/page-header'

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Welcome Header */}
      <PageHeader
        title={`Welcome back! ${session?.user?.firstName ?? ''}`}
        subtitle="Here's what's happening with your electrical business today."
      />

      {/* Stats Grid */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs font-medium sm:text-sm'>
              Total Quotations
            </CardTitle>
            <FileText className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-lg font-bold sm:text-2xl'>24</div>
            <p className='text-muted-foreground text-xs'>+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs font-medium sm:text-sm'>
              Active Products
            </CardTitle>
            <Package className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-lg font-bold sm:text-2xl'>156</div>
            <p className='text-muted-foreground text-xs'>+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs font-medium sm:text-sm'>
              Customers
            </CardTitle>
            <Users className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-lg font-bold sm:text-2xl'>89</div>
            <p className='text-muted-foreground text-xs'>+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs font-medium sm:text-sm'>
              Revenue
            </CardTitle>
            <TrendingUp className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-lg font-bold sm:text-2xl'>₹2,45,000</div>
            <p className='text-muted-foreground text-xs'>
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Recent Activity and Quick Actions */}
      <div className='grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2'>
        {/* Recent Quotations */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-lg sm:text-xl'>
              Recent Quotations
            </CardTitle>
            <CardDescription className='text-sm'>
              Your latest quotation requests and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3 sm:space-y-4'>
              {[1, 2, 3].map(item => (
                <div
                  key={item}
                  className='flex items-center space-x-3 sm:space-x-4'
                >
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 sm:h-10 sm:w-10'>
                    <FileText className='h-4 w-4 sm:h-5 sm:w-5' />
                  </div>
                  <div className='min-w-0 flex-1 space-y-1'>
                    <p className='text-xs font-medium sm:text-sm'>
                      Quote #QT-{2024000 + item}
                    </p>
                    <p className='text-muted-foreground truncate text-xs'>
                      Battery backup system for Office Complex
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs font-medium sm:text-sm'>₹45,000</p>
                    <p className='text-muted-foreground text-xs'>2h ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-lg sm:text-xl'>Quick Actions</CardTitle>
            <CardDescription className='text-sm'>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 sm:gap-4'>
              <div className='hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-3 sm:space-x-4 sm:p-4'>
                <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10'>
                  <FileText className='text-primary-foreground h-4 w-4 sm:h-5 sm:w-5' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-medium sm:text-sm'>
                    Create New Quotation
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Generate a professional quote
                  </p>
                </div>
              </div>

              <div className='hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-3 sm:space-x-4 sm:p-4'>
                <div className='bg-secondary flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10'>
                  <Calculator className='text-secondary-foreground h-4 w-4 sm:h-5 sm:w-5' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-medium sm:text-sm'>
                    Battery Calculator
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Calculate backup time and requirements
                  </p>
                </div>
              </div>

              <div className='hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-3 sm:space-x-4 sm:p-4'>
                <div className='bg-muted flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10'>
                  <Package className='text-muted-foreground h-4 w-4 sm:h-5 sm:w-5' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-medium sm:text-sm'>
                    Manage Products
                  </p>
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
