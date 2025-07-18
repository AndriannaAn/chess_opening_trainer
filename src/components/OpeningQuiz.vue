<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import ChessBoard from './ChessBoard.vue'
import { openings } from '@/data/openings'
import type { Opening } from '@/data/openings'
// ————— Constants & shuffle helper —————
const STATS_KEY = 'quizStats'
const DECK_KEY = 'quizDeck'
const inputRef = ref<HTMLInputElement | null>(null)
const nextBtn = ref<HTMLButtonElement | null>(null)

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
    .replace(/[\u2010-\u2015\-]|[’']|\s+/g, (m) => (/[’']/.test(m) ? '' : ' '))
}

function checkAnswer() {
  if (result.value || !currentOpening.value) return
  const actual = normalizeName(currentOpening.value.name)
  const attempt = normalizeName(guess.value)

  isCorrect.value = attempt === actual
  result.value = true

  nextTick(() => {
    nextBtn.value?.focus()
  })

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
  nextTick(() => {
    inputRef.value?.focus()
  })
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
onMounted(async () => {
  loadStats()
  loadDeck()
  drawOpening()
  await nextTick()
  inputRef.value?.focus()
})
</script>

<template>
  <div class="quiz-container">
    <!-- 1) Header row -->
    <header class="header">
      <h1>♟ Chess Opening Trainer</h1>
    </header>

    <!-- 2) Stats sidebar -->
    <aside class="stats">
      <p class="stats‐metrics">
        <span>Answered: {{ stats.total }} </span>
        <span>Correct: {{ stats.correct }} ({{ percentage }}%) </span>
        <span>Streak: {{ stats.streak }} </span>
        <span>Best Streak: {{ stats.bestStreak }}</span>
      </p>
      <button class="reset-btn" @click="resetSession">Start Over</button>
    </aside>

    <!-- 3) Main quiz area -->
    <section class="quiz">
      <ChessBoard :moves="currentOpening?.moves || []" />

      <p class="moves">
        Moves: <strong>{{ currentOpening?.moves.join(', ') }}</strong>
      </p>

      <form v-if="!result" @submit.prevent="checkAnswer">
        <input ref="inputRef" v-model="guess" type="text" placeholder="Guess the opening name" />
        <button type="submit">Submit</button>
      </form>

      <div v-else class="result">
        <p class="your-guess">
          Your answer: <em>{{ guess }}</em>
        </p>
        <p v-if="isCorrect" class="correct">✅ Correct!</p>
        <p v-else class="wrong">
          ❌ Incorrect. It was: <strong>{{ currentOpening?.name }}</strong>
        </p>

        <div class="info">
          <p><strong>ECO:</strong> {{ currentOpening?.eco }}</p>
          <p>{{ currentOpening?.description }}</p>
          <button ref="nextBtn" type="button" @click="nextOpening">Next Opening</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.quiz-container {
  display: grid;
  grid-template-areas:
    'header'
    'stats'
    'quiz';
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  gap: 1.5rem;
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;

  .stats,
  .header,
  .quiz {
    min-width: 0;
  }

  .result,
  .info {
    overflow-wrap: break-word;
    word-break: break-word;
  }
}

.header {
  grid-area: header;
  text-align: center;
}

/* stats panel */
.stats {
  grid-area: stats;
  background: var(--color-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;

  p {
    margin: 0 0 0.5rem;
    color: var(--color-muted);
    font-size: 0.9rem;
  }
  .reset-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    background: var(--color-secondary);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: filter 0.2s;
    &:hover {
      filter: brightness(0.9);
    }
  }
}

/* quiz panel */
.quiz {
  grid-area: quiz;
  background: var(--color-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.moves {
  font-style: italic;
  font-size: 0.9rem;
  color: var(--color-muted);
}

input {
  width: 100%;
  max-width: 300px;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

button {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: filter 0.2s;
  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.result {
  width: 100%;
  text-align: center;
  margin-top: 1rem;

  p {
    margin: 0.3rem 0;
    font-weight: 500;
  }
  .correct {
    color: var(--color-success);
  }
  .wrong {
    color: var(--color-error);
  }

  .info {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-muted);
    strong {
      color: var(--color-text);
    }
  }
}
.stats‐metrics span {
  display: inline-block;
  margin-bottom: 0.25rem;
  border: 1px solid lightsteelblue;
  padding: 4px;
  margin: 0 2px;
  border-radius: 4px;
}

.your-guess {
  margin-bottom: 0.5rem;
  font-style: italic;
  color: var(--color-muted);
}
/* ── Desktop: two‑column layout ── */
@media (min-width: 1024px) {
  .quiz {
    width: 600px;
  }

  .quiz-container {
    grid-template-areas:
      'stats header'
      'stats quiz';
    grid-template-columns: 240px minmax(0, 1fr);
    grid-template-rows: auto 1fr;
  }

  .header {
    text-align: center;
  }
  .stats {
    text-align: left;
  }
  .stats‐metrics {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    span {
      border: none;
    }
  }
}
</style>
