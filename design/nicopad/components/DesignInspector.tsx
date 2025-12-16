import React, { useState, useEffect } from 'react';
import { Ruler, MousePointer2 } from 'lucide-react';

export const DesignInspector: React.FC = () => {
  const [active, setActive] = useState(false);
  const [info, setInfo] = useState<{ rect: DOMRect; label: string } | null>(null);

  useEffect(() => {
    if (!active) {
      setInfo(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Use elementFromPoint to find the element under cursor
      // We stop propagation to avoid complex bubbling issues, though for inspection purely visual is fine
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      
      // If we are hovering over the inspector button itself or nothing, ignore
      if (!target || target.closest('.design-inspector-ui')) {
        setInfo(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      
      setInfo({
        rect,
        label: `${Math.round(rect.width)} × ${Math.round(rect.height)}`,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [active]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] design-inspector-ui font-sans">
        <button
          onClick={() => setActive(!active)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl border transition-all duration-300 backdrop-blur-md ${
            active 
              ? 'bg-cyan-500 text-white border-cyan-400 ring-4 ring-cyan-500/20' 
              : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white hover:bg-black hover:scale-105'
          }`}
        >
          {active ? <MousePointer2 size={16} /> : <Ruler size={16} />}
          <span className="text-xs font-bold tracking-wide uppercase">
            {active ? 'Inspecting' : 'Design Inspect'}
          </span>
        </button>
      </div>

      {active && info && (
        <div
          className="fixed pointer-events-none z-[9998] transition-all duration-75 ease-out border-2 border-cyan-400 bg-cyan-400/10"
          style={{
            top: info.rect.top,
            left: info.rect.left,
            width: info.rect.width,
            height: info.rect.height,
          }}
        >
          {/* Measurement Label */}
          <div className="absolute -top-7 left-0 flex items-center gap-2">
            <div className="bg-cyan-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap font-mono">
              {info.label}
            </div>
          </div>
          
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-1 h-1 bg-white shadow-sm"></div>
          <div className="absolute top-0 right-0 w-1 h-1 bg-white shadow-sm"></div>
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-white shadow-sm"></div>
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-white shadow-sm"></div>
        </div>
      )}
    </>
  );
};