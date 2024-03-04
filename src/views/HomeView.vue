<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'
import Actor from '@/components/Actor.vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const message = ref("")

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
  message.value = localStorage.getItem('message')
  if (message.value) {
    localStorage.removeItem('message')
  }
})
</script>

<template>
  <div class="px-20 lg:px-30 xl:px-40">
    <h1 class="text-4xl text-center p-10 font-bold">Homepage</h1>
    <p v-if="message">{{ message }}</p>
    <div class="flex flex-col gap-10">
      <div class="my-xl flex flex-col items-center gap-7">
        <h1 class="text-xl font-bold">4 films</h1>
        <div class="flex flex-col justify-center items-center 2xl:grid 2xl:grid-cols-2 gap-10">
          <div v-if="movies" v-for="movie in movies.slice(0, 4)">
            <Movie :movie="movie" />
          </div>
          <div v-else>
            <p>Loading...</p>
          </div>
        </div>
      </div>
      <div class="my-xl flex flex-col items-center gap-7">
        <h1 class="text-xl font-bold">4 acteurs</h1>
        <div class="flex flex-col justify-center items-center 2xl:grid 2xl:grid-cols-2 gap-10">
          <div v-if="actors" v-for="actor in actors.slice(0, 4)">
            <Actor :actor="actor" />
          </div>
          <div v-else>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
