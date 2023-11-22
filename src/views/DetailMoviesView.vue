<script setup>
import { useRoute } from 'vue-router'
import {onMounted, ref} from "vue";
import Actor from "@/components/Actor.vue";
import router from "@/router";
import moment from "moment/moment";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const route = useRoute()

// Pour récupérer un paramètre de l'URL
const id = route.params.id

let movie = ref('')

onMounted(async () => {
  const response = await fetch('http://localhost:8000/api/movies/' + id, {
    headers: {
      'Content-Type': 'application/json',
          'Accept': 'application/json',
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
  <h1>Détail du film</h1>
  <h1>Fiche Film n°{{ movie.id }}</h1>
  <h3>Titre : {{ movie.title ? movie.title : 'loading...' }}</h3>
  <p>Description : {{ movie.description ? movie.description : 'loading...' }}</p>
  <p>Temps du film :{{ movie.duration ? movie.duration : 'loading...' }}</p>
  <p>Date de sortie : {{ moment(movie.releaseDate).format('DD/MM/YYYY') }}</p>
  <p>Sorti il y a {{ moment().diff(moment(movie.releaseDate), "month") }} mois</p>
  <div v-for="actors in movie.actor">
    <Actor :actor="actors" />
  </div>
</template>

<style></style>