<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import OpeningQuiz from '@/components/OpeningQuiz.vue'
</script>

<template>
  <div class="app">
    <h1>♟ Chess Opening Trainer</h1>
    <OpeningQuiz />
  </div>
</template>

<style scoped lang="scss">
.app {
  text-align: center;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;

  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
}
</style>
