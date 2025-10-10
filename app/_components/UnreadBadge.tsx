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
        min-w-[18px] h-[18px] 
        text-xs font-medium text-white 
        bg-red-500 rounded-full 
        px-1
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}