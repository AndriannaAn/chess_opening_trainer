<template>
  <TheChessboard
    :position="fen"
    :board-width="360"
    :board-height="360"
    :arePiecesDraggable="false"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Chess } from 'chess.js'
import { TheChessboard } from 'vue3-chessboard'

const props = defineProps<{
  moves: string[]
}>()

const game = new Chess()
const fen = ref('start')

watch(() => props.moves, (newMoves) => {
  game.reset()
  for (const move of newMoves) {
    game.move(move)
  }
  fen.value = game.fen()
}, { immediate: true })
</script>
