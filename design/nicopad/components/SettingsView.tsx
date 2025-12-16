import React from 'react';
import { Moon, Sun, Globe, Check, ArrowLeft, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  language: string;
  setLanguage: (l: string) => void;
  audioQuality: string;
  setAudioQuality: (q: string) => void;
  // Boolean settings
  autoplay: boolean;
  setAutoplay: (v: boolean) => void;
  showLyrics: boolean;
  setShowLyrics: (v: boolean) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  theme, 
  setTheme, 
  language, 
  setLanguage, 
  audioQuality,
  setAudioQuality,
  autoplay,
  setAutoplay,
  showLyrics,
  setShowLyrics,
  notifications,
  setNotifications,
  onBack 
}) => {
  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Fixed Header Area */}
      <div className="shrink-0 px-6 pt-6 pb-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
             <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-8">
        <div className="space-y-8 max-w-[280px] pt-4">
          
          {/* Appearance Section */}
          <section>
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 pl-1">Appearance</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-gradient-to-b from-white to-zinc-50 border-rose-200/50 shadow-sm ring-1 ring-rose-200 dark:ring-0' 
                    : 'bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors mb-2 ${theme === 'light' ? 'bg-orange-100 text-orange-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                  <Sun size={14} strokeWidth={2.5} />
                </div>
                <span className={`text-xs font-bold ${theme === 'light' ? 'text-zinc-900' : 'text-zinc-500 dark:text-zinc-400'}`}>Light</span>
                {theme === 'light' && <div className="absolute top-2 right-2 text-rose-500"><Check size={10} strokeWidth={4} /></div>}
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-zinc-700 shadow-sm ring-1 ring-indigo-500/20' 
                    : 'bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors mb-2 ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                  <Moon size={14} strokeWidth={2.5} />
                </div>
                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}`}>Dark</span>
                {theme === 'dark' && <div className="absolute top-2 right-2 text-indigo-400"><Check size={10} strokeWidth={4} /></div>}
              </button>
            </div>
          </section>

          {/* Audio Quality Section (Radio Buttons) */}
          <section>
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 pl-1">Streaming Quality</h3>
            <div className="flex flex-col gap-2">
              {['High (Lossless)', 'Standard', 'Data Saver'].map((quality) => (
                <button
                  key={quality}
                  onClick={() => setAudioQuality(quality)}
                  className="flex items-center gap-3 px-1 py-1 group cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    audioQuality === quality 
                      ? 'border-primary bg-primary' 
                      : 'border-zinc-300 dark:border-zinc-600 bg-transparent group-hover:border-primary'
                  }`}>
                    {audioQuality === quality && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in duration-200" />}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    audioQuality === quality 
                      ? 'text-zinc-900 dark:text-zinc-100' 
                      : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                  }`}>
                    {quality}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Preferences (Checkboxes) */}
          <section>
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 pl-1">Preferences</h3>
            <div className="flex flex-col gap-3">
               {/* Autoplay */}
               <button 
                 onClick={() => setAutoplay(!autoplay)} 
                 className="flex items-center gap-3 group cursor-pointer w-full text-left"
               >
                 <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 ${
                   autoplay 
                     ? 'bg-primary border-primary' 
                     : 'border-zinc-300 dark:border-zinc-600 bg-transparent group-hover:border-primary'
                 }`}>
                   {autoplay && <Check size={10} className="text-white" strokeWidth={3} />}
                 </div>
                 <span className={`text-xs font-medium transition-colors ${
                   autoplay ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'
                 }`}>
                   Autoplay similar songs
                 </span>
               </button>

               {/* Show Lyrics */}
               <button 
                 onClick={() => setShowLyrics(!showLyrics)} 
                 className="flex items-center gap-3 group cursor-pointer w-full text-left"
               >
                 <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 ${
                   showLyrics 
                     ? 'bg-primary border-primary' 
                     : 'border-zinc-300 dark:border-zinc-600 bg-transparent group-hover:border-primary'
                 }`}>
                   {showLyrics && <Check size={10} className="text-white" strokeWidth={3} />}
                 </div>
                 <span className={`text-xs font-medium transition-colors ${
                   showLyrics ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'
                 }`}>
                   Show lyrics automatically
                 </span>
               </button>

               {/* Notifications */}
               <button 
                 onClick={() => setNotifications(!notifications)} 
                 className="flex items-center gap-3 group cursor-pointer w-full text-left"
               >
                 <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 ${
                   notifications 
                     ? 'bg-primary border-primary' 
                     : 'border-zinc-300 dark:border-zinc-600 bg-transparent group-hover:border-primary'
                 }`}>
                   {notifications && <Check size={10} className="text-white" strokeWidth={3} />}
                 </div>
                 <span className={`text-xs font-medium transition-colors ${
                   notifications ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'
                 }`}>
                   Desktop notifications
                 </span>
               </button>
            </div>
          </section>

          {/* Language Section */}
          <section>
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 pl-1">Language</h3>
            <div className="flex flex-col gap-1 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl p-1 border border-zinc-100 dark:border-zinc-800">
              {['English', '简体中文'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    language === lang 
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={14} className={language === lang ? 'text-primary' : 'text-zinc-400 opacity-50'} />
                    {lang}
                  </div>
                  {language === lang && <Check size={12} className="text-primary" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </section>

          {/* Storage Section */}
          <section>
             <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 pl-1">Storage</h3>
             <button 
               className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/30 group"
               onClick={() => alert('Cache cleared!')}
             >
               <span className="flex items-center gap-3">
                 <Trash2 size={14} className="text-zinc-400 group-hover:text-red-500 transition-colors"/>
                 Clear App Cache
               </span>
             </button>
             <p className="mt-2 pl-1 text-[10px] text-zinc-400">
               Free up space by clearing temporary files.
             </p>
          </section>

        </div>
      </div>
    </div>
  );
};