<template>
  <div class="quiz">
    <p class="moves">
      Moves: <strong>{{ opening.moves.join(', ') }}</strong>
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
        ❌ Incorrect. It was: <strong>{{ opening.name }}</strong>
      </p>

      <div class="info">
        <p><strong>ECO:</strong> {{ opening.eco }}</p>
        <p>{{ opening.description }}</p>
        <button @click="nextOpening">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { openings } from '@/data/openings.ts'

const index = ref(Math.floor(Math.random() * openings.length))
const opening = ref(openings[index.value])
const guess = ref('')
const result = ref(false)
const isCorrect = ref(false)

function checkAnswer() {
  isCorrect.value = guess.value.trim().toLowerCase() === opening.value.name.toLowerCase()
  result.value = true
}

function nextOpening() {
  guess.value = ''
  result.value = false
  index.value = Math.floor(Math.random() * openings.length)
  opening.value = openings[index.value]
}
</script>

<style scoped lang="scss">
.quiz {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  input {
    padding: 0.5rem;
    font-size: 1rem;
    width: 300px;
    max-width: 90%;
  }

  button {
    padding: 0.5rem 1rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 6px;
    border: none;
    background-color: #222;
    color: #fff;
  }

  .result {
    margin-top: 1rem;
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
