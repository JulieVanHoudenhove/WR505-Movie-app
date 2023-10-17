<script setup>
import { onMounted, ref } from 'vue'
import Actor from '@/components/Actor.vue'
import Movie from "@/components/Movie.vue";
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let movies = ref([])
let actors = ref([])

onMounted(async () => {
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

  filter()
})

let resultat = ref([])
let recherche = ref('')

let filter = () => {
  resultat.value = actors.value
      .map((actor, index) => ({ actor, index }))
      .filter(({ actor }) => actor.lastName.toLowerCase().includes(recherche.value.toLowerCase()));
}
</script>

<template>
  <h1 class="text-2xl font-bold">Tous les acteurs</h1>
  <div class="my-xl">
    <input placeholder="search an actor" type="text" v-model="recherche" @input="filter" class="border-b">
    <button @click="filter">Recherche</button>
    <div class="grid grid-cols-4">
      <div v-if="actors" v-for="actor in resultat">
        <Actor :actor="actor.actor" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>