<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'

let movies = ref([])

onMounted(async () => {
  const movieResponse = await fetch('http://localhost:8000/api/movies?page=1', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  movies.value = await movieResponse.json()
})
</script>

<template>
  <h1 class="text-2xl font-bold">Tous les films</h1>
  <div class="my-xl">
    <div class="grid grid-cols-4">
      <div v-if="movies" v-for="movie in movies">
        <Movie :movie="movie" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style></style>