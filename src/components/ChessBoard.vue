<template>
  <div class="board">
    <div v-for="(row, r) in boardRows" :key="r" class="rank">
      <div
        v-for="(cell, f) in row"
        :key="f"
        class="square"
        :class="{
          dark: (r + f) % 2 === 1,
        }"
      >
        <span class="piece">{{ pieceSymbol(cell) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { Chess } from 'chess.js'

const props = defineProps<{ moves: string[] }>()

// Compute the final FEN after applying moves:
const fen = computed(() => {
  const game = new Chess()
  for (const m of props.moves) {
    game.move(m.trim())
  }
  return game.fen().split(' ')[0] // only the board part
})

// Turn that FEN into an array of 8 ranks × 8 files:
const boardRows = computed(() => {
  return fen.value.split('/').map((rank) => {
    const row: string[] = []
    for (const c of rank) {
      if (/[1-8]/.test(c)) {
        // expand digits to that many empty squares
        row.push(...Array(Number(c)).fill(''))
      } else {
        row.push(c)
      }
    }
    return row
  })
})

// Map a piece‐letter to a Unicode symbol:
function pieceSymbol(letter: string) {
  return (
    (
      {
        K: '♔',
        Q: '♕',
        R: '♖',
        B: '♗',
        N: '♘',
        P: '♙',
        k: '♚',
        q: '♛',
        r: '♜',
        b: '♝',
        n: '♞',
        p: '♟',
        '': '',
      } as Record<string, string>
    )[letter] || ''
  )
}
</script>

<style scoped>
.board {
  display: inline-grid;
  grid-template-rows: repeat(8, 48px);
  border: 2px solid #333;
}
.rank {
  display: inline-grid;
  grid-template-columns: repeat(8, 48px);
}
.square {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.square.dark {
  background: #b58863;
}
.square:not(.dark) {
  background: #f0d9b5;
}
.piece {
  font-size: 32px;
  line-height: 1;
}
</style>
