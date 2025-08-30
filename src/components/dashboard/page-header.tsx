import { JSX } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  actions?: JSX.Element
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-3xl font-bold'>{title}</h1>
        <p className='text-muted-foreground'>{subtitle}</p>
      </div>
      <div>{actions}</div>
    </div>
  )
}
