<script setup>
import { useRoute } from 'vue-router'
import {onMounted, ref} from "vue";
import Movie from "@/components/Movie.vue";
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const route = useRoute()

// Pour récupérer un paramètre de l'URL
const id = route.params.id

let actor = ref('')

onMounted(async () => {
  const response = await fetch('http://localhost:8000/api/actors/' + id, {
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
  actor.value = await response.json()
})
</script>

<template>
  <h1>Détail de l'acteur</h1>
  <h1>Fiche Acteur n°{{ actor.id }}</h1>
  <h3>Prénom : {{ actor.firstName ? actor.firstName : 'loading...' }}</h3>
  <p>Nom : {{ actor.lastName ? actor.lastName : 'loading...' }}</p>
  <p>Nationalité : {{ actor.nationality.nationality ? actor.nationality.nationality : 'loading...' }}</p>
  <div v-if="actor.movies">
    <p>Les films dans lesquels il a joué</p>
    <div v-for="movies in actor.movies">
      <Movie :movie="movies" />
    </div>
  </div>
</template>

<style></style>