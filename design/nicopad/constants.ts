import { Song, User, Playlist } from './types';

export const MOCK_USER: User = {
  name: "Alex Chen",
  avatarUrl: "https://picsum.photos/seed/user_alex/200/200",
  isVip: true,
  tier: 'Diamond'
};

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: '1', name: 'Chill Lo-Fi', count: 42 },
  { id: '2', name: 'Deep Focus', count: 18 },
  { id: '3', name: 'Cyberpunk Synth', count: 25 },
  { id: '4', name: 'Gym Motivation', count: 50 },
];

export const MOCK_SONGS: Song[] = [
  {
    id: '101',
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    coverUrl: "https://picsum.photos/seed/m83/300/300",
    duration: "4:03",
    durationSec: 243
  },
  {
    id: '102',
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    coverUrl: "https://picsum.photos/seed/weeknd/300/300",
    duration: "3:50",
    durationSec: 230
  },
  {
    id: '103',
    title: "Nightcall",
    artist: "Kavinsky",
    album: "OutRun",
    coverUrl: "https://picsum.photos/seed/kavinsky/300/300",
    duration: "4:18",
    durationSec: 258
  },
  {
    id: '104',
    title: "Instant Crush",
    artist: "Daft Punk",
    album: "Random Access Memories",
    coverUrl: "https://picsum.photos/seed/daftpunk/300/300",
    duration: "5:37",
    durationSec: 337
  },
  {
    id: '105',
    title: "Resonance",
    artist: "Home",
    album: "Odyssey",
    coverUrl: "https://picsum.photos/seed/home/300/300",
    duration: "3:32",
    durationSec: 212
  },
  {
    id: '106',
    title: "After Dark",
    artist: "Mr. Kitty",
    album: "Time",
    coverUrl: "https://picsum.photos/seed/kitty/300/300",
    duration: "4:17",
    durationSec: 257
  }
];