<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'
import router from "@/router";
import CreateMovieView from "@/views/CreateMovieView.vue";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let movies = ref([])
let resultat = ref([])
let recherche = ref('')
let nextPage = ref('')
let previousPage = ref('')

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
      nextPage.value = data['hydra:view']['hydra:next'];
      previousPage.value = data['hydra:view']['hydra:previous'];
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

async function pagePrevious() {
  try {
    const response = await fetch('http://localhost:8000' + previousPage.value, {
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
      previousPage.value = data['hydra:view']['hydra:previous'];
      nextPage.value = data['hydra:view']['hydra:next'];
      filter()
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function pageNext() {
  try {
    const response = await fetch('http://localhost:8000' + nextPage.value, {
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
      previousPage.value = data['hydra:view']['hydra:previous'];
      nextPage.value = data['hydra:view']['hydra:next'];
      filter()
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

const toggleForm = ref(false)

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

</script>

<template>
  <h1 class="text-2xl font-bold">Tous les films</h1>
  <div class="my-xl">
    <input placeholder="search a movie" type="text" v-model="recherche" @input="filter" class="border-b">
    <button @click="filter">Recherche</button>
    <div>
      <button v-if="roles === 'ROLE_ADMIN'" @click="toggleForm = true">Ajouter un film</button>
      <div v-if="toggleForm === true" class="bg-white">
        <CreateMovieView @create-movie="getMovies(); toggleForm = false" />
      </div>
    </div>
    <div class="grid grid-cols-4">
      <div v-if="movies" v-for="movie in resultat">
        <Movie @update-movie="getMovies()" :movie="movie.movie" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
  <div class="flex justify-between">
    <button v-if="previousPage" @click="pagePrevious()">Précédent</button>
    <button v-else disabled>Précédent</button>
    <button v-if="nextPage" @click="pageNext()">Suivant</button>
    <button v-else disabled>Suivant</button>
  </div>
</template>

<style></style>
