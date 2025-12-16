import React from 'react';
import { Play, BarChart2 } from 'lucide-react';
import { Song } from '../types';

interface SongListProps {
  songs: Song[];
  currentSongId: string;
  isPlaying: boolean;
  favorites: Set<string>;
  onPlay: (songId: string) => void;
}

export const SongList: React.FC<SongListProps> = ({ songs, currentSongId, isPlaying, favorites, onPlay }) => {
  return (
    <div className="w-full h-full px-2 pt-2 overflow-y-auto custom-scrollbar pb-6">
      <div className="space-y-1">
        {songs.map((song, index) => {
          const isCurrent = currentSongId === song.id;
          
          return (
            <div 
              key={song.id}
              onClick={() => onPlay(song.id)}
              className={`group flex items-center px-4 py-3 rounded-lg text-sm transition-all cursor-pointer border border-transparent ${
                isCurrent 
                  ? 'bg-zinc-100 border-zinc-200/50 shadow-sm dark:bg-zinc-900 dark:border-zinc-800' 
                  : 'hover:bg-zinc-50 hover:border-zinc-100 dark:hover:bg-zinc-900/50 dark:hover:border-zinc-800'
              }`}
            >
              {/* Index / State */}
              <div className="w-8 flex items-center justify-start text-xs font-medium">
                {isCurrent && isPlaying ? (
                   <BarChart2 size={12} className="text-primary animate-pulse" />
                ) : (
                   <span className="font-mono text-zinc-400 group-hover:hidden dark:text-zinc-600">{index + 1}</span>
                )}
                <Play size={12} className="hidden group-hover:block text-zinc-400 group-hover:text-primary dark:text-zinc-500" fill="currentColor" />
              </div>
              
              {/* Song Info */}
              <div className="flex-1 flex items-center gap-4 min-w-0">
                <img 
                  src={song.coverUrl} 
                  alt="" 
                  className={`w-10 h-10 rounded-lg object-cover transition-all shadow-sm ${isCurrent ? 'opacity-100 ring-2 ring-primary/20' : 'opacity-90 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`} 
                />
                <div className="flex flex-col truncate justify-center">
                  <span className={`text-sm font-bold truncate leading-tight ${isCurrent ? 'text-primary' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {song.title}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500 truncate leading-tight mt-1">
                    {song.artist}
                  </span>
                </div>
              </div>

              {/* Time / Fav */}
              <div className="text-right text-xs font-mono text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-400 w-14">
                {favorites.has(song.id) ? (
                   <span className="text-primary mr-2">♥</span>
                ) : null}
                {song.duration}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};