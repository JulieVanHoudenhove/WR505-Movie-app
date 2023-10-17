<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'
import Actor from '@/components/Actor.vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let movies = ref([])
let actors = ref([])

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
  const actorResponse = await fetch('http://localhost:8000/api/actors?page=1', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  if (actorResponse.status === 401) {
    localStorage.removeItem('token')
    router.push('/login')
  }
  actors.value = await actorResponse.json()
})
</script>

<template>
  <main class="mx-36">
  <h1 class="text-2xl font-bold">Homepage</h1>
  <div class="my-xl">
    <h1 class="text-xl font-bold">4 films</h1>
    <div class="flex justify-between">
      <div v-if="movies" v-for="movie in movies.slice(0, 4)">
        <Movie :movie="movie" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
  <div class="text-xl font-bold">
    <h1>4 acteurs</h1>
    <div class="flex justify-between">
      <div v-if="actors" v-for="actor in actors.slice(0, 4)">
        <Actor :actor="actor" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
  </main>
</template>
