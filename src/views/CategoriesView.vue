<script setup>
import { onMounted, ref } from 'vue'
import Movie from '@/components/Movie.vue'

let categories = ref([])

onMounted(async () => {
  const categoriesResponse = await fetch('http://localhost:8000/api/categories?page=1', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  categories.value = await categoriesResponse.json()
})
</script>

<template>
  <h1 class="text-2xl font-bold">Toutes les catégories</h1>
  <div class="my-xl">
    <div class="grid grid-cols-4">
      <div v-if="categories" v-for="categorie in categories">
        <p>{{ categorie.name }}</p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>