export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string; // Display string like "3:45"
  durationSec: number;
}

export interface User {
  name: string;
  avatarUrl: string;
  isVip: boolean;
  tier?: 'Gold' | 'Platinum' | 'Diamond';
}

export interface Playlist {
  id: string;
  name: string;
  count: number;
}