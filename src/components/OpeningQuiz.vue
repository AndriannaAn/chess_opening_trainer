<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import ChessBoard from './ChessBoard.vue'
import { openings, Opening } from '@/data/openings'

// ————— Constants & shuffle helper —————
const STATS_KEY = 'quizStats'
const DECK_KEY = 'quizDeck'

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice()
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

const stats = reactive<Stats>({
  total: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
})

function loadStats() {
  const raw = localStorage.getItem(STATS_KEY)
  if (raw) Object.assign(stats, JSON.parse(raw))
}

function saveStats() {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

// ————— Deck persistence —————
const deck = ref<number[]>([])

function loadDeck() {
  const raw = localStorage.getItem(DECK_KEY)
  let parsed: number[] = []

  if (raw) {
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = []
    }
  }

  // If it’s not the right length, rebuild from scratch
  if (!Array.isArray(parsed) || parsed.length !== openings.length) {
    parsed = shuffleArray(openings.map((_, i) => i))
    localStorage.setItem(DECK_KEY, JSON.stringify(parsed))
  }

  deck.value = parsed
}

function saveDeck() {
  localStorage.setItem(DECK_KEY, JSON.stringify(deck.value))
}

// ————— Quiz state —————
const currentOpening = ref<Opening | null>(null)
const guess = ref('')
const result = ref(false)
const isCorrect = ref(false)

const percentage = computed(() =>
  stats.total ? Math.round((stats.correct / stats.total) * 100) : 0,
)

// Draw next opening (and persist deck)
function drawOpening() {
  if (!deck.value.length) {
    deck.value = shuffleArray(openings.map((_, i) => i))
  }
  const idx = deck.value.shift()!
  saveDeck()
  currentOpening.value = openings[idx]
}

// Check answer and update stats
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
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak)
  } else {
    stats.streak = 0
  }
  saveStats()
}

// Move to the next opening
function nextOpening() {
  guess.value = ''
  result.value = false
  isCorrect.value = false
  drawOpening()
}

// Reset entire session: stats + deck
function resetSession() {
  // clear stats
  stats.total = 0
  stats.correct = 0
  stats.streak = 0
  stats.bestStreak = 0
  saveStats()

  // clear & reshuffle deck
  deck.value = shuffleArray(openings.map((_, i) => i))
  saveDeck()

  // load first opening
  drawOpening()
}

// on mount, load persisted state and draw
onMounted(() => {
  loadStats()
  loadDeck()
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
      <button class="reset-btn" @click="resetSession">Start Over</button>
    </div>

    <!-- Quiz -->
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
  gap: 1.5rem;

  .stats {
    width: 100%;
    text-align: center;
    background: #f7f7f7;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #333;

    .reset-btn {
      margin-left: 1rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      background: #e74c3c;
      color: #fff;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
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
