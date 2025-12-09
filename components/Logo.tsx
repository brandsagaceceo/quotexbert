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
  sm: { width: 32, height: 32, textSize: "text-lg" },
  md: { width: 48, height: 48, textSize: "text-2xl" },
  lg: { width: 64, height: 64, textSize: "text-3xl" },
  xl: { width: 80, height: 80, textSize: "text-4xl" }
};

export default function Logo({ 
  size = "md", 
  showText = true, 
  href = "/", 
  className = "" 
}: LogoProps) {
  const { width, height, textSize } = sizeMap[size];
  
  const logoContent = (
    <div className={`flex items-center ${className}`}>
      <span className={`font-black bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent ${textSize} tracking-tight`}>
        QuoteXbert
      </span>
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