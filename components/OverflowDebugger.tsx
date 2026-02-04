"use client";

import { useEffect } from 'react';

/**
 * Development tool to detect horizontal overflow
 * Only runs in development mode
 */
export function OverflowDebugger() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const checkOverflow = () => {
      const body = document.body;
      const html = document.documentElement;
      
      const bodyScrollWidth = body.scrollWidth;
      const htmlScrollWidth = html.scrollWidth;
      const windowWidth = window.innerWidth;
      
      if (bodyScrollWidth > windowWidth || htmlScrollWidth > windowWidth) {
        console.warn('🚨 HORIZONTAL OVERFLOW DETECTED:');
        console.warn(`Window width: ${windowWidth}px`);
        console.warn(`Body scrollWidth: ${bodyScrollWidth}px`);
        console.warn(`HTML scrollWidth: ${htmlScrollWidth}px`);
        
        // Find the widest element
        const allElements = document.querySelectorAll('*');
        let widestElement: Element | null = null;
        let maxWidth = windowWidth;
        
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const elementWidth = rect.right;
          
          if (elementWidth > maxWidth) {
            maxWidth = elementWidth;
            widestElement = el;
          }
        });
        
        if (widestElement) {
          console.warn('Widest element:', widestElement);
          console.warn('Element width:', maxWidth);
          console.warn('Classes:', widestElement.className);
          
          // Highlight the element temporarily
          const originalOutline = (widestElement as HTMLElement).style.outline;
          (widestElement as HTMLElement).style.outline = '3px solid red';
          setTimeout(() => {
            (widestElement as HTMLElement).style.outline = originalOutline;
          }, 3000);
        }
      } else {
        console.log('✅ No horizontal overflow detected');
      }
    };
    
    // Check on mount and when window resizes
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Check when estimate results appear
    const observer = new MutationObserver(() => {
      checkOverflow();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
      observer.disconnect();
    };
  }, []);
  
  return null;
}
