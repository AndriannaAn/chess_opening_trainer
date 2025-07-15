<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import ChessBoard from './ChessBoard.vue'
import { openings, Opening } from '@/data/openings'

// ————— Shuffle helper —————
function shuffleArray<T>(array: T[]): T[] {
  const a = array.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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
    } catch {}
  }
}
function saveStats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}
function resetStats() {
  stats.total = 0
  stats.correct = 0
  stats.streak = 0
  stats.bestStreak = 0
  saveStats()
}

// ————— Quiz state —————
const deck = ref<number[]>([])
const currentOpening = ref<Opening | null>(null)

const guess = ref('')
const result = ref(false)
const isCorrect = ref(false)

const percentage = computed(() =>
  stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
)

// Draw the next opening index from the deck
function drawOpening() {
  if (deck.value.length === 0) {
    // once exhausted, reshuffle the full deck
    deck.value = shuffleArray(openings.map((_, i) => i))
  }
  const idx = deck.value.shift()!
  currentOpening.value = openings[idx]
}

// ————— Quiz logic —————
function normalizeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\-]+/g, ' ')
    .replace(/\s+/g, ' ')
}

function checkAnswer() {
  if (result.value || !currentOpening.value) return
  const actual = normalizeName(currentOpening.value.name)
  const attempt = normalizeName(guess.value)

  isCorrect.value = attempt === actual
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
  // reset UI state
  guess.value = ''
  result.value = false
  isCorrect.value = false
  // pick the next one
  drawOpening()
}

onMounted(() => {
  loadStats()
  // initialize & shuffle the deck, then draw first
  deck.value = shuffleArray(openings.map((_, i) => i))
  drawOpening()
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

    <!-- Quiz (only once we have a currentOpening) -->
    <div v-if="currentOpening" class="quiz">
      <ChessBoard :moves="currentOpening.moves" />

      <p class="moves">
        Moves: <strong>{{ currentOpening.moves.join(', ') }}</strong>
      </p>

      <input
        v-model="guess"
        type="text"
        placeholder="Guess the opening name"
        @keyup.enter="checkAnswer"
      />
      <button @click="checkAnswer">Submit</button>

      <div v-if="result" class="result">
        <p v-if="isCorrect" class="correct">✅ Correct!</p>
        <p v-else class="wrong">
          ❌ Incorrect. It was: <strong>{{ currentOpening.name }}</strong>
        </p>

        <div class="info">
          <p><strong>ECO:</strong> {{ currentOpening.eco }}</p>
          <p>{{ currentOpening.description }}</p>
          <button @click="nextOpening">Next Opening</button>
        </div>
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
