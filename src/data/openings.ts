export interface Opening {
  name: string
  eco: string
  moves: string[]
  description: string
}

export const openings: Opening[] = [
  {
    name: 'Ruy Lopez',
    eco: 'C60',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description: 'A classic opening focusing on central control and piece development.',
  },
  {
    name: 'Sicilian Defense',
    eco: 'B20',
    moves: ['e4', 'c5'],
    description: 'The most popular response to 1.e4, aiming for counterattack.',
  },
  {
    name: "Queen's Gambit",
    eco: 'D06',
    moves: ['d4', 'd5', 'c4'],
    description: 'A pawn sacrifice to seize the center and open lines for your pieces.',
  },
  {
    name: "King's Indian Defense",
    eco: 'E60',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
    description: 'A hypermodern defense, allowing White a big center that Black later attacks.',
  },
  {
    name: 'Nimzo‑Indian Defense',
    eco: 'E20',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    description: 'Pins the knight on c3 to double White’s pawns and control the center.',
  },
  {
    name: 'English Opening',
    eco: 'A10',
    moves: ['c4'],
    description: 'A flank opening aiming for central control with c‑ and d‑pawn breaks.',
  },
  {
    name: 'Italian Game',
    eco: 'C50',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    description: 'Develops pieces naturally and eyes the vulnerable f7 square.',
  },
  {
    name: 'Scotch Game',
    eco: 'C44',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4'],
    description: 'Opens the center early to launch piece activity and tactical chances.',
  },
  {
    name: 'Caro‑Kann Defense',
    eco: 'B10',
    moves: ['e4', 'c6'],
    description:
      'A solid, less‐sharp defense than the Sicilian, aiming for a strong pawn structure.',
  },
  {
    name: 'Pirc Defense',
    eco: 'B07',
    moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6'],
    description: 'Allows White a broad center while planning a later counter‑attack.',
  },
  {
    name: 'Slav Defense',
    eco: 'D10',
    moves: ['d4', 'd5', 'c4', 'c6'],
    description: 'A rock-solid response to the Queen’s Gambit that fights for the center.',
  },
  {
    name: 'Catalan Opening',
    eco: 'E00',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'g3'],
    description: 'Combines elements of the Queen’s Gambit and Reti for long‑term pressure on d5.',
  },
  {
    name: 'King’s Gambit',
    eco: 'C30',
    moves: ['e4', 'e5', 'f4'],
    description: 'A daring pawn sacrifice to open lines and launch a quick attack on Black’s king.',
  },
  {
    name: 'Petrov’s Defense',
    eco: 'C42',
    moves: ['e4', 'e5', 'Nf3', 'Nf6'],
    description:
      'Leads to solid, symmetrical positions where Black neutralizes White’s opening advantage.',
  },
  {
    name: 'Four Knights Game',
    eco: 'C47',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'],
    description: 'Peaceful development aiming for flexible central play and piece harmony.',
  },
  {
    name: 'Vienna Game',
    eco: 'C25',
    moves: ['e4', 'e5', 'Nc3'],
    description: 'Similar to the King’s Gambit but delays f4, leading to rich attacking chances.',
  },
  {
    name: 'Scandinavian Defense',
    eco: 'B01',
    moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3'],
    description: 'Immediately challenges White’s center; leads to active queen play for Black.',
  },
  {
    name: 'Alekhine’s Defense',
    eco: 'B03',
    moves: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6'],
    description: 'Entices White to build a center only to attack and undermine it later.',
  },
  {
    name: 'London System',
    eco: 'D02',
    moves: ['d4', 'Nf6', 'Nf3', 'd5', 'Bf4'],
    description: 'A solid, system‐style setup with early bishop development to f4.',
  },
  {
    name: 'Benoni Defense',
    eco: 'A60',
    moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6'],
    description:
      'Sharp counterattack against the Queen’s Pawn, creating imbalanced pawn structures.',
  },
  {
    name: 'Bird’s Opening',
    eco: 'A02',
    moves: ['f4'],
    description: 'A flank opening aiming to control e5 quickly and unbalance the position.',
  },
]
