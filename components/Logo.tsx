"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { width: 24, height: 24, textSize: "text-lg" },
  md: { width: 32, height: 32, textSize: "text-xl" },
  lg: { width: 48, height: 48, textSize: "text-2xl" },
  xl: { width: 64, height: 64, textSize: "text-3xl" }
};

export default function Logo({ 
  size = "md", 
  showText = true, 
  href = "/", 
  className = "" 
}: LogoProps) {
  const { width, height, textSize } = sizeMap[size];
  
  const logoContent = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Image
        src="/logo.svg"
        alt="QuoteXbert Logo"
        width={width}
        height={height}
        className="w-auto h-auto"
        priority
      />
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-red-900 to-teal-700 bg-clip-text text-transparent ${textSize}`}>
          QuoteXbert
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href}
        className="hover:opacity-90 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-md"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}