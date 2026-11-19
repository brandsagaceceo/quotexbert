"use client";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "responsive-header";
  showText?: boolean;
  href?: string;
  className?: string;
}
const iconSizes = { sm: 28, md: 36, lg: 44, xl: 56, "2xl": 72, "3xl": 96, "responsive-header": 36 };
export default function Logo({ size = "md", showText = true, href = "/", className = "" }: LogoProps) {
  const content = (
    <span className={`qx-logo ${size === "responsive-header" ? "qx-logo-header" : ""} ${className}`}
      style={{ "--qx-logo-size": `${iconSizes[size]}px` } as CSSProperties}>
      <span className="qx-logo-icon">
        <Image src="/branding/quotexbert-qx-icon-display.webp" alt={showText ? "" : "QuoteXbert"}
          width={558} height={540} unoptimized priority={size === "responsive-header"} />
      </span>
      {showText && <span className="qx-logo-wordmark">
        <Image src="/branding/quotexbert-wordmark-display.webp" alt="QuoteXbert"
          width={2036} height={353} unoptimized priority={size === "responsive-header"} />
      </span>}
    </span>
  );
  return href ? <Link href={href} className="qx-logo-link">{content}</Link> : content;
}
