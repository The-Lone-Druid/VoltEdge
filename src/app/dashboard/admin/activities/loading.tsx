import { Skeleton } from '@/components/ui/skeleton'

export default function ActivityLogsLoading() {
  return (
    <div className='container mx-auto space-y-6 py-6'>
      <div className='mb-6'>
        <Skeleton className='mb-2 h-8 w-48' />
        <Skeleton className='h-4 w-96' />
      </div>

      <div className='space-y-4'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-64' />
              </div>
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
