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
  <h1>Oui</h1>
  <h1>Fiche Film n°{{ actor.id }}</h1>
  <h3>{{ actor.firstName ? actor.firstName : 'loading...' }}</h3>
  <p>{{ actor.lastName ? actor.lastName : 'loading...' }}</p>
  <p>{{ actor.nationality }}</p>
  <div v-for="movies in actor.movies">
    <Movie :movie="movies" />
  </div>
</template>

<style></style>