import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings, Repeat, Shuffle, MonitorPlay } from 'lucide-react';
import { Song } from '../types';
import { Slider } from './ui/Slider';

interface PlayerControlsProps {
  currentSong: Song;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  isFavorite: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (val: number) => void;
  onToggleFavorite: () => void;
  onOpenSettings: () => void;
  playMode: 'sequence' | 'loop' | 'shuffle';
  onTogglePlayMode: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentSong,
  isPlaying,
  progress,
  currentTime,
  isFavorite,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleFavorite,
  onOpenSettings,
  playMode,
  onTogglePlayMode
}) => {
  const [quality, setQuality] = useState<'HD' | '4K'>('HD');

  const toggleQuality = () => {
    setQuality(prev => prev === 'HD' ? '4K' : 'HD');
  };

  return (
    <div className="bg-white border-t border-zinc-100 px-5 py-2 flex items-center justify-between z-20 relative h-[60px] dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300">
      
      {/* Track Info */}
      <div className="flex items-center gap-3 w-[25%] min-w-0">
        <div className="relative group cursor-pointer overflow-hidden rounded-md shrink-0 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <img 
            src={currentSong.coverUrl} 
            alt={currentSong.title} 
            className="w-9 h-9 object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center overflow-hidden min-w-0 gap-0.5">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate cursor-pointer hover:text-primary dark:hover:text-primary transition-colors">{currentSong.title}</h4>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate cursor-pointer">{currentSong.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center w-[40%]">
        <div className="flex items-center gap-4">
          <button onClick={onPrev} className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors active:scale-95">
            <SkipBack size={16} fill="currentColor" />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-rose-400 active:scale-95 transition-all shadow-md shadow-rose-200 dark:shadow-none"
          >
            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={onNext} className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors active:scale-95">
            <SkipForward size={16} fill="currentColor" />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 mt-1 text-[9px] text-zinc-400 dark:text-zinc-500 font-mono font-medium">
          <span className="w-6 text-right text-zinc-500 dark:text-zinc-500">{formatTime(currentTime)}</span>
          <Slider 
            value={currentTime} 
            max={currentSong.durationSec} 
            onChange={onSeek} 
            className="h-1"
          />
          <span className="w-6 text-left text-zinc-500 dark:text-zinc-500">{currentSong.duration}</span>
        </div>
      </div>

      {/* Volume & Settings & Quality */}
      <div className="flex items-center justify-end gap-2 w-[35%]">
         {/* Settings */}
         <button 
            onClick={onOpenSettings}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title="Settings"
         >
            <Settings size={14} />
         </button>

         {/* Play Order */}
         <button 
           onClick={onTogglePlayMode}
           className={`transition-colors ${playMode !== 'sequence' ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
           title="Play Order"
         >
           {playMode === 'shuffle' ? (
             <Shuffle size={14} />
           ) : (
             <Repeat size={14} className={playMode === 'loop' ? '' : 'opacity-100'} />
           )}
           {playMode === 'loop' && <span className="absolute text-[8px] font-bold -mt-1 ml-2">1</span>} 
         </button>

         <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

         {/* Volume */}
         <div className="flex items-center gap-2 w-24 group">
            <Volume2 size={14} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-400" />
            <Slider value={70} max={100} onChange={() => {}} className="w-full h-1" />
         </div>

         {/* Quality */}
         <button 
           onClick={toggleQuality}
           className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-primary hover:text-primary"
         >
           {quality}
         </button>
      </div>

    </div>
  );
};