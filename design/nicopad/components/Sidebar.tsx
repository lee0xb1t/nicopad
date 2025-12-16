import React from 'react';
import { Command } from 'lucide-react';
import { User, Playlist } from '../types';

interface SidebarProps {
  user: User;
  playlists: Playlist[];
  activeView: string;
  onNavigate: (view: string) => void;
  onToggleVip: () => void;
  onToggleLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, playlists, activeView, onNavigate, onToggleVip, onToggleLogin }) => {
  return (
    <aside className="w-[200px] flex flex-col border-r h-full transition-all duration-300 bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      
      {/* App Header / Logo */}
      <div className="px-6 py-4 pt-6">
        <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-rose-200 dark:shadow-none">
            N
          </div>
          <span className="font-bold text-base tracking-widest text-zinc-900 dark:text-zinc-100">NICOPAD</span>
        </div>
      </div>

      {/* Playlists (Primary Nav now) */}
      <div className="px-5 py-0 flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 pl-2">
           <Command size={10} /> Library
        </div>
        <div className="space-y-0.5">
           {/* 'All Tracks' acts as Home */}
           <button
              onClick={() => onNavigate('home')}
              className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-md transition-all group ${
                activeView === 'home' 
                  ? 'bg-white text-primary shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-primary dark:ring-zinc-700' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeView === 'home' ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600 group-hover:bg-zinc-400'}`}></div>
                <span className="truncate text-xs font-medium">All Tracks</span>
              </div>
            </button>

          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => onNavigate(`playlist-${pl.id}`)}
              className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-md transition-all group ${
                activeView === `playlist-${pl.id}` 
                  ? 'bg-white text-primary shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-primary dark:ring-zinc-700' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeView === `playlist-${pl.id}` ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600 group-hover:bg-zinc-400'}`}></div>
                <span className="truncate text-xs font-medium">{pl.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-3 w-full">
           <div 
             className="relative group cursor-pointer" 
             onClick={onToggleLogin}
             title="Click to switch account"
           >
             <img src={user.avatarUrl} className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm group-hover:border-primary/50 transition-colors" alt=""/>
             <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
           </div>
           
           <div className="flex flex-col justify-center">
             <span className="text-xs text-zinc-900 dark:text-zinc-200 font-bold leading-none mb-0.5">{user.name}</span>
           </div>
           
           <div 
             onClick={onToggleVip}
             className="ml-auto relative group/vip cursor-pointer select-none"
           >
              {/* Glow effect - only for active VIP */}
              <div className={`absolute -inset-1 rounded-full blur-sm transition-opacity duration-500 ${user.isVip ? 'bg-amber-400/30 opacity-0 group-hover/vip:opacity-100' : 'bg-transparent'}`}></div>
              
              {/* Badge */}
              <div className={`relative px-2.5 py-0.5 rounded-full flex items-center justify-center border shadow-sm overflow-hidden transform transition-all group-hover/vip:scale-105 ${
                user.isVip 
                  ? 'bg-white border-amber-400' 
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
              }`}>
                
                {/* Shimmer - only for active VIP */}
                {user.isVip && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-100/60 to-transparent translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>
                )}

                <span className={`text-[9px] font-black tracking-widest transition-colors ${
                  user.isVip ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-500'
                }`}>
                  VIP
                </span>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
};