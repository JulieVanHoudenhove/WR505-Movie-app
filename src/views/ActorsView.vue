<script setup>
import { onMounted, ref } from 'vue'
import Actor from '@/components/Actor.vue'
import Movie from "@/components/Movie.vue";

let movies = ref([])
let actors = ref([])

onMounted(async () => {
  const actorResponse = await fetch('http://localhost:8000/api/actors?page=1', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  actors.value = await actorResponse.json()
})
</script>

<template>
  <h1 class="text-2xl font-bold">Tous les acteurs</h1>
  <div class="my-xl">
    <div class="grid grid-cols-4">
      <div v-if="actors" v-for="actor in actors">
        <Actor :actor="actor" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>