<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import ChessBoard from './ChessBoard.vue'
import { openings, Opening } from '@/data/openings'

// ————— Stats persistence —————
interface Stats {
  total: number
  correct: number
  streak: number
  bestStreak: number
}
const STORAGE_KEY = 'quizStats'

const stats = reactive<Stats>({ total: 0, correct: 0, streak: 0, bestStreak: 0 })

function loadStats() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      Object.assign(stats, JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }
}
function saveStats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

// **New**: Reset everything
function resetStats() {
  stats.total = 0
  stats.correct = 0
  stats.streak = 0
  stats.bestStreak = 0
  saveStats()
}

// ————— Quiz state & logic —————
const index = ref(Math.floor(Math.random() * openings.length))
const currentOpening = ref<Opening>(openings[index.value])

const guess = ref('')
const result = ref(false)
const isCorrect = ref(false)

const percentage = computed(() =>
  stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
)

function checkAnswer() {
  if (result.value) return
  isCorrect.value = guess.value.trim().toLowerCase() === currentOpening.value.name.toLowerCase()
  result.value = true

  stats.total++
  if (isCorrect.value) {
    stats.correct++
    stats.streak++
    if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak
  } else {
    stats.streak = 0
  }
  saveStats()
}

function nextOpening() {
  guess.value = ''
  result.value = false
  isCorrect.value = false
  index.value = Math.floor(Math.random() * openings.length)
  currentOpening.value = openings[index.value]
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="quiz-container">
    <!-- Stats Panel -->
    <div class="stats">
      <p>
        Answered: {{ stats.total }} | Correct: {{ stats.correct }} ({{ percentage }}%) | Streak:
        {{ stats.streak }} | Best Streak: {{ stats.bestStreak }}
      </p>
      <button class="reset-btn" @click="resetStats">Start Over</button>
    </div>

    <!-- Chess board and moves -->
    <ChessBoard :moves="currentOpening.moves" />

    <p class="moves">
      Moves: <strong>{{ currentOpening.moves.join(', ') }}</strong>
    </p>

    <!-- Guess input -->
    <input
      v-model="guess"
      type="text"
      placeholder="Guess the opening name"
      @keyup.enter="checkAnswer"
    />
    <button @click="checkAnswer">Submit</button>

    <!-- Result feedback -->
    <div v-if="result" class="result">
      <p v-if="isCorrect" class="correct">✅ Correct!</p>
      <p v-else class="wrong">
        ❌ Incorrect. It was: <strong>{{ currentOpening.name }}</strong>
      </p>

      <div class="info">
        <p><strong>ECO:</strong> {{ currentOpening.eco }}</p>
        <p>{{ currentOpening.description }}</p>
        <button @click="nextOpening">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .stats {
    width: 100%;
    text-align: center;
    background: #f7f7f7;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #333;
  }

  .moves {
    font-style: italic;
  }

  input,
  button {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .result {
    text-align: center;

    .correct {
      color: green;
    }
    .wrong {
      color: red;
    }

    .info {
      margin-top: 0.5rem;
    }
  }
}
</style>
