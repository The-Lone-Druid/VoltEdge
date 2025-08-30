interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div>
      <h1 className='text-3xl font-bold'>{title}</h1>
      <p className='text-muted-foreground'>{subtitle}</p>
    </div>
  )
}
