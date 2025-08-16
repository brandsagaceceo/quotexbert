import Image from 'next/image'

interface ProBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function ProBadge({ size = 'md', showText = true }: ProBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className="flex items-center">
      <div className="relative">
        <Image
          src="/logo.svg"
          alt="Pro Badge"
          width={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          height={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          className={sizeClasses[size]}
        />
        <div className="absolute inset-0 rounded-full border-2 border-brand"></div>
      </div>
      {showText && (
        <span className={`ml-2 font-bold text-brand ${textSizes[size]}`}>
          PRO
        </span>
      )}
    </div>
  )
}
