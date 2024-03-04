<script setup>
import { useRoute } from 'vue-router'
import {onMounted, ref} from "vue";
import Actor from "@/components/Actor.vue";
import router from "@/router";
import moment from "moment/moment";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const route = useRoute()

// Pour récupérer un paramètre de l'URL
const id = route.params.id

let movie = ref('')

onMounted(async () => {
  const response = await fetch(API_URL + '/api/movies/' + id, {
    headers: {
          'Authorization': 'Bearer ' + token
    }
  })
  if (response.status === 401) {
    localStorage.removeItem('token')
    router.push('/login')
  }
  movie.value = await response.json()
})
</script>

<template>
  <div class="px-20 lg:px-30 xl:px-40">
    <h1 class="text-4xl text-center p-10 font-bold">Détail du film</h1>
    <div class="flex flex-col items-center mb-5">
      <p><span class="font-bold text-lg">Titre : </span>{{ movie.title ? movie.title : 'loading...' }}</p>
      <p class="text-center"><span class="font-bold text-lg">Description : </span>{{ movie.description ? movie.description : 'loading...' }}</p>
      <p class="text-center"><span class="font-bold text-lg">Temps du film : </span>{{ movie.duration ? movie.duration : 'loading...' }}</p>
      <p class="text-center"><span class="font-bold text-lg">Date de sortie : </span>{{ moment(movie.releaseDate).format('DD/MM/YYYY') }}</p>
      <p><span class="font-bold text-lg">Sorti il y a : </span>{{ moment().diff(moment(movie.releaseDate), "month") }} mois</p>
    </div>
    <div class="flex flex-col items-center gap-7" v-if="movie.actor">
      <p class="font-bold text-lg">Les acteurs du film : </p>
      <div class="w-full flex flex-col justify-center items-center 2xl:grid 2xl:grid-cols-2 gap-10">
        <div v-for="actor in movie.actor">
          <Actor :actor="actor" />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>