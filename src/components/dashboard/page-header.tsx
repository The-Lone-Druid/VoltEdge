import { JSX } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  actions?: JSX.Element
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-2xl font-bold sm:text-3xl'>{title}</h1>
        <p className='text-muted-foreground text-sm sm:text-base'>{subtitle}</p>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  )
}
