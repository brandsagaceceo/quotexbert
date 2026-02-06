'use client';

import { useEffect, useState } from 'react';

/**
 * Development QA tool to detect horizontal overflow issues on mobile
 * Only active in development mode
 */
export default function OverflowDetector() {
  const [overflowElements, setOverflowElements] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const checkOverflow = () => {
      const bodyWidth = document.body.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      if (bodyWidth > viewportWidth) {
        // Find which elements are causing overflow
        const offenders: string[] = [];
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const rect = htmlEl.getBoundingClientRect();
          
          if (rect.right > viewportWidth || rect.width > viewportWidth) {
            const tag = htmlEl.tagName.toLowerCase();
            const id = htmlEl.id ? `#${htmlEl.id}` : '';
            const className = htmlEl.className ? `.${htmlEl.className.toString().split(' ')[0]}` : '';
            offenders.push(`${tag}${id}${className} (width: ${Math.round(rect.width)}px)`);
          }
        });
        
        if (offenders.length > 0) {
          setOverflowElements(offenders.slice(0, 5)); // Limit to first 5
          console.warn('[OverflowDetector] Horizontal overflow detected:', {
            bodyWidth,
            viewportWidth,
            overflow: bodyWidth - viewportWidth,
            offenders: offenders.slice(0, 10)
          });
        }
      } else {
        setOverflowElements([]);
      }
    };

    // Check on mount and resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Also check after DOM mutations (debounced)
    let timeoutId: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkOverflow, 500);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => {
      window.removeEventListener('resize', checkOverflow);
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || overflowElements.length === 0) {
    return null;
  }

  return (
    <>
      {/* Warning Badge */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-32 left-2 z-[9999] bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-red-700 transition-all"
        title="Click to see overflow details"
      >
        ⚠️ Overflow Detected
      </button>

      {/* Details Panel */}
      {isVisible && (
        <div className="fixed top-44 left-2 z-[9999] bg-white border-2 border-red-600 rounded-lg shadow-xl p-4 max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-red-600 text-sm">Horizontal Overflow</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Elements wider than viewport:
          </p>
          <ul className="text-xs space-y-1">
            {overflowElements.map((el, idx) => (
              <li key={idx} className="font-mono text-red-700 break-all">
                {el}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
