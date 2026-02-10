interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export function UnreadBadge({ count, className = "" }: UnreadBadgeProps) {
  if (count === 0) return null;

  return (
    <span 
      className={`
        inline-flex items-center justify-center 
        min-w-[22px] h-[22px] 
        text-xs font-bold text-white 
        bg-gradient-to-br from-red-500 to-red-600 
        rounded-full 
        px-1.5
        shadow-lg shadow-red-500/50
        animate-pulse
        ring-2 ring-white
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}