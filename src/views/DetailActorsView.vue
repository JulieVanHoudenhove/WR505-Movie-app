<script setup>
import { useRoute } from 'vue-router'
import {onMounted, ref} from "vue";
import Movie from "@/components/Movie.vue";
import router from "@/router";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const route = useRoute()

// Pour récupérer un paramètre de l'URL
const id = route.params.id

let actor = ref('')

onMounted(async () => {
  const response = await fetch(API_URL + '/api/actors/' + id, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  if (response.status === 401) {
    localStorage.removeItem('token')
    router.push('/login')
  }
  actor.value = await response.json()
})
</script>

<template>
  <div class="px-20 lg:px-30 xl:px-40">
    <h1 class="text-4xl text-center p-10 font-bold">Détail de l'acteur</h1>
    <div class="flex flex-col items-center mb-5">
      <p><span class="font-bold text-lg">Prénom : </span>{{ actor.firstName ? actor.firstName : 'loading...' }}</p>
      <p class="text-center"><span class="font-bold text-lg">Nom : </span>{{ actor.lastName ? actor.lastName : 'loading...' }}</p>
      <p class="text-center"><span class="font-bold text-lg">Nationalité : </span>{{ actor ? actor.nationality.nationality : 'loading...' }}</p>
    </div>
    <div class="flex flex-col items-center gap-7" v-if="actor.movies">
      <p class="font-bold text-lg">Les films dans lesquels il a joué</p>
      <div class="w-full flex flex-col justify-center items-center 2xl:grid 2xl:grid-cols-2 gap-10">
        <div v-for="movies in actor.movies">
          <Movie :movie="movies" />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>