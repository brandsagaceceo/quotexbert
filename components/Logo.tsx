"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "responsive-header";
  showText?: boolean;
  href?: string;
  className?: string;
}

// Width:height ratio matches logo.svg viewBox (200:240 = 5:6)
const sizeMap = {
  sm: { width: 32, height: 38, textSize: "text-lg" },
  md: { width: 40, height: 48, textSize: "text-2xl" },
  lg: { width: 50, height: 60, textSize: "text-3xl" },
  xl: { width: 67, height: 80, textSize: "text-4xl" },
  "2xl": { width: 100, height: 120, textSize: "text-5xl" },
  "3xl": { width: 125, height: 150, textSize: "text-6xl" },
  "responsive-header": { width: 36, height: 43, textSize: "text-xl sm:text-2xl md:text-3xl" }
};

export default function Logo({ 
  size = "md", 
  showText = true, 
  href = "/", 
  className = "" 
}: LogoProps) {
  const { width, height, textSize } = sizeMap[size];
  
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="QuoteXbert mascot"
        width={width}
        height={height}
        priority
        className="shrink-0"
      />
      {showText && (
        <span className={`font-black bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent ${textSize} tracking-tight`}>
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
