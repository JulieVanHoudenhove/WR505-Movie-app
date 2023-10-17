<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let movies = ref([])

onMounted(async () => {
  const movieResponse = await fetch('http://localhost:8000/api/movies?page=1', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  if (movieResponse.status === 401) {
    localStorage.removeItem('token')
    router.push('/login')
  }
  movies.value = await movieResponse.json()

  filter()
})

let resultat = ref([])
let recherche = ref('')

let filter = () => {
  resultat.value = movies.value
      .map((movie, index) => ({ movie, index }))
      .filter(({ movie }) => movie.title.toLowerCase().includes(recherche.value.toLowerCase()));
}
</script>

<template>
  <h1 class="text-2xl font-bold">Tous les films</h1>
  <div class="my-xl">
    <input placeholder="search a movie" type="text" v-model="recherche" @input="filter" class="border-b">
    <button @click="filter">Recherche</button>
    <div class="grid grid-cols-4">
      <div v-if="movies" v-for="movie in resultat">
        <Movie :movie="movie.movie" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style></style>