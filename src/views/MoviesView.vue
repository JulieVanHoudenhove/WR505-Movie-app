<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'
import router from "@/router";
import CreateMovieView from "@/views/CreateMovieView.vue";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const toggleForm = ref(false)

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

let movies = ref([])
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
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function searchMovie() {
  try {
    const response = await fetch('http://localhost:8000/api/movies?title=' + recherche.value, {
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
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
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
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

</script>

<template>
  <div class="px-20 lg:px-30 xl:px-40">
    <h1 class="text-4xl text-center p-10 font-bold">Tous les films</h1>
    <div class="flex gap-7 flex-col justify-center items-center m-10">
      <div class="flex flex-col md:flex-row items-center gap-5">
        <input placeholder="rechercher un film" type="text" v-model="recherche" @input="searchMovie" class="border-b rounded-md">
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="searchMovie">Recherche</button>
      </div>
      <button class="w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="roles === 'ROLE_ADMIN'" @click="toggleForm = true">Ajouter un film</button>
    </div>
    <div class="my-xl">
      <div>
        <div v-if="toggleForm === true" class="bg-white">
          <CreateMovieView @create-movie="getMovies(); toggleForm = false" />
        </div>
      </div>
      <div class="flex flex-col justify-center items-center 2xl:grid 2xl:grid-cols-2 gap-10">
        <div v-if="movies" v-for="movie in movies">
          <Movie @update-movie="getMovies()" @delete-movie="getMovies()" :movie="movie" />
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>
    </div>
    <div class="flex my-16 justify-between">
      <button class="w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="previousPage" @click="pagePrevious()">Précédent</button>
      <button class="cursor-not-allowed w-fit min-h-[42px] hover:bg-[#D64343] hover:text-white rounded-md border border-[#D64343] bg-transparent text-[#D64343] px-5" v-else disabled>Précédent</button>
      <button class="w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="nextPage" @click="pageNext()">Suivant</button>
      <button class="cursor-not-allowed w-fit min-h-[42px] hover:bg-[#D64343] hover:text-white rounded-md border border-[#D64343] bg-transparent text-[#D64343] px-5" v-else disabled>Suivant</button>
    </div>
  </div>
</template>

<style></style>
