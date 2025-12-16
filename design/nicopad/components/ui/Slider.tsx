import React from 'react';

interface SliderProps {
  value: number;
  max: number;
  onChange: (val: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, max, onChange, className = "" }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`relative w-full h-1 flex items-center group cursor-pointer ${className}`}>
      {/* Track Background */}
      <div className="absolute w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors">
        {/* Fill */}
        <div 
          className="h-full bg-primary group-hover:bg-rose-400 transition-colors duration-300" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Thumb */}
      <div 
        className="absolute w-2.5 h-2.5 bg-white dark:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ left: `calc(${percentage}% - 5px)` }}
      />

      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />
    </div>
  );
};