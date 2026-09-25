// The songs the site's animations play, so a track looks the same wherever it
// turns up: the same cover, the same colour on the widget.
export interface Song {
  title: string
  artist: string
  // The colour Queueify would sample from the cover for the widget
  accent: string
  // The cover, drawn as sky, sun and hills: light, mid and dark
  cover: [string, string, string]
}

export const SONGS = {
  mindFields: { title: 'Mind Fields', artist: 'No Vacation', accent: '#f2a93b', cover: ['#ffe2a3', '#f2a93b', '#6b3a10'] },
  happenTwice: { title: 'Happen Twice', artist: 'Mark Whalen', accent: '#b57bea', cover: ['#e2c8ff', '#9b5de5', '#2d1b4e'] },
  setPiece: { title: 'Set Piece', artist: 'Vansire', accent: '#e8875a', cover: ['#f9c9a6', '#e8875a', '#4b2f78'] },
  thePlace: { title: 'The Place', artist: 'Far Caspian', accent: '#ef9a86', cover: ['#ffd9cc', '#ec8f79', '#5a2e3a'] },
  bloodhounds: { title: 'Bloodhounds', artist: 'Small Forward', accent: '#d2b77e', cover: ['#f3e6c4', '#cfae6c', '#4a3a22'] },
  reaper: { title: 'Reaper', artist: 'No Vacation', accent: '#8c9bff', cover: ['#dfe7ff', '#7c8cff', '#1f2552'] },
  hotelCalifornia: { title: 'Hotel California', artist: 'Eagles', accent: '#e0b25b', cover: ['#fbe3b0', '#d99a3e', '#3b2410'] },
} satisfies Record<string, Song>

// Twitch hands each chatter a colour; these are the ones the animations use
export const CHATTERS = {
  olticul: '#ff7f50',
  Rileyjo7: '#5aa9ff',
  glorysynex: '#9acd32',
  OmniscientBot: '#ff69b4',
  uhRyvn: '#daa520',
  roquettm: '#b57bea',
} as const
