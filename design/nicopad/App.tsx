import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { PlayerControls } from './components/PlayerControls';
import { SongList } from './components/SongList';
import { SettingsView } from './components/SettingsView';
import { MOCK_SONGS, MOCK_USER, MOCK_PLAYLISTS } from './constants';
import { Minus, Square, X } from 'lucide-react';
import { User } from './types';

const GUEST_USER: User = {
  name: "Login",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", 
  isVip: false
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('home');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['101', '104']));
  
  // User State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(MOCK_USER);

  // Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('English');
  const [audioQuality, setAudioQuality] = useState('Standard');
  
  // Checkbox Settings State
  const [autoplay, setAutoplay] = useState(true);
  const [showLyrics, setShowLyrics] = useState(true);
  const [notifications, setNotifications] = useState(false);
  
  // Player State
  const [playMode, setPlayMode] = useState<'sequence' | 'loop' | 'shuffle'>('sequence');

  const currentSong = MOCK_SONGS[currentSongIndex];

  // Apply Theme
  useEffect(() => {
    const root = window.document.body;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Mock Audio Progress
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.durationSec) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSongIndex]); 

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (playMode === 'shuffle') {
      const nextIndex = Math.floor(Math.random() * MOCK_SONGS.length);
      setCurrentSongIndex(nextIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % MOCK_SONGS.length);
    }
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (playMode === 'shuffle') {
      const prevIndex = Math.floor(Math.random() * MOCK_SONGS.length);
      setCurrentSongIndex(prevIndex);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + MOCK_SONGS.length) % MOCK_SONGS.length);
    }
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (val: number) => {
    setCurrentTime(val);
  };

  const handlePlaySong = (id: string) => {
    const idx = MOCK_SONGS.findIndex(s => s.id === id);
    if (idx !== -1) {
      if (idx === currentSongIndex) {
        handleTogglePlay();
      } else {
        setCurrentSongIndex(idx);
        setCurrentTime(0);
        setIsPlaying(true);
      }
    }
  };

  const handleToggleFavorite = () => {
    const newFavs = new Set(favorites);
    if (newFavs.has(currentSong.id)) {
      newFavs.delete(currentSong.id);
    } else {
      newFavs.add(currentSong.id);
    }
    setFavorites(newFavs);
  };
  
  const handleTogglePlayMode = () => {
    setPlayMode(prev => {
      if (prev === 'sequence') return 'loop';
      if (prev === 'loop') return 'shuffle';
      return 'sequence';
    });
  };

  const handleToggleVip = () => {
    if (!isLoggedIn) return;
    setUser(prev => ({ ...prev, isVip: !prev.isVip }));
  };
  
  const handleToggleLogin = () => {
    setIsLoggedIn(prev => !prev);
  };

  const displaySongs = useMemo(() => {
    if (activeView === 'favorites') {
      return MOCK_SONGS.filter(s => favorites.has(s.id));
    }
    return MOCK_SONGS;
  }, [activeView, favorites]);
  
  const displayUser = isLoggedIn ? user : GUEST_USER;

  const viewTitle = activeView === 'settings' ? 'Settings' : activeView === 'home' ? 'All Tracks' : activeView === 'favorites' ? 'Favorites' : activeView.startsWith('playlist') ? 'Playlist' : 'Albums';

  return (
    <div className={`w-[800px] h-[580px] rounded-lg shadow-2xl overflow-hidden flex flex-col border select-none transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'} ${theme}`}>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar 
          user={displayUser} 
          playlists={MOCK_PLAYLISTS} 
          activeView={activeView}
          onNavigate={setActiveView}
          onToggleVip={handleToggleVip}
          onToggleLogin={handleToggleLogin}
        />
        
        <main className={`flex-1 relative flex flex-col min-w-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
          
          {/* Header with Title and Windows Controls */}
          <div className={`h-12 shrink-0 flex items-center justify-between z-10 sticky top-0 pl-6 pr-0 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-50'}`}>
             <div className="flex items-center gap-3 pt-2">
               <h1 className={`text-lg font-bold tracking-wide uppercase ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{viewTitle}</h1>
               {activeView !== 'settings' && (
                 <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${theme === 'dark' ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200'}`}>
                   {displaySongs.length}
                 </span>
               )}
             </div>

             {/* Windows Style Controls */}
             <div className="flex items-start self-start">
                <button className={`h-8 w-10 flex items-center justify-center transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                  <Minus size={16} strokeWidth={1.5} />
                </button>
                <button className={`h-8 w-10 flex items-center justify-center transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                  <Square size={14} strokeWidth={1.5} />
                </button>
                <button className={`h-8 w-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors rounded-tr-lg ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <X size={16} strokeWidth={1.5} />
                </button>
             </div>
          </div>

          {/* View Content */}
          <div className={`flex-1 overflow-hidden relative pl-4 pt-2 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
             {activeView === 'settings' ? (
               <SettingsView 
                  theme={theme} 
                  setTheme={setTheme} 
                  language={language}
                  setLanguage={setLanguage}
                  audioQuality={audioQuality}
                  setAudioQuality={setAudioQuality}
                  autoplay={autoplay}
                  setAutoplay={setAutoplay}
                  showLyrics={showLyrics}
                  setShowLyrics={setShowLyrics}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  onBack={() => setActiveView('home')}
               />
             ) : (
               <SongList 
                 songs={displaySongs}
                 currentSongId={currentSong.id}
                 isPlaying={isPlaying}
                 favorites={favorites}
                 onPlay={handlePlaySong}
               />
             )}
          </div>
        </main>
      </div>

      {/* Bottom Player */}
      <PlayerControls 
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={(currentTime / currentSong.durationSec) * 100}
        currentTime={currentTime}
        isFavorite={favorites.has(currentSong.id)}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onToggleFavorite={handleToggleFavorite}
        onOpenSettings={() => setActiveView('settings')}
        playMode={playMode}
        onTogglePlayMode={handleTogglePlayMode}
      />
    </div>
  );
};

export default App;