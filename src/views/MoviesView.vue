<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let movies = ref([])
let resultat = ref([])
let recherche = ref('')
let pageNext = ref('')
let pagePrevious = ref('')

onMounted(async () => {
  await getMovies()
})

async function getMovies() {
  try {
    const response = await fetch('http://localhost:8000/api/movies', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
    filter()
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function filter() {
  resultat.value = movies.value
      .map((movie, index) => ({ movie, index }))
      .filter(({ movie }) => movie.title.toLowerCase().includes(recherche.value.toLowerCase()));
}

async function previousPage() {
  try {
    const response = await fetch(`http://localhost:8000${pagePrevious.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
      filter()
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function nextPage() {
  try {
    const response = await fetch(`http://localhost:8000${pageNext.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
      filter()
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
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
  <div class="flex justify-between">
    <button v-if="pagePrevious" @click="previousPage()">Précédent</button>
    <button v-else disabled>Précédent</button>
    <button v-if="pageNext" @click="nextPage()">Suivant</button>
    <button v-else disabled>Suivant</button>
  </div>
</template>

<style></style>
