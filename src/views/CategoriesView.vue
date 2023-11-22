<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";
import Movie from '@/components/Movie.vue'

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let categories = ref([])

onMounted(async () => {
  const categoriesResponse = await fetch('http://localhost:8000/api/categories?page=1', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  if (categoriesResponse.status === 401) {
    localStorage.removeItem('token')
    router.push('/login')
  }
  categories.value = await categoriesResponse.json()

  filter()
})

let resultat = ref([])
let recherche = ref('')

let filter = () => {
  resultat.value = categories.value
      .map((categorie, index) => ({ categorie, index }))
      .filter(({ categorie }) => categorie.name.toLowerCase().includes(recherche.value.toLowerCase()));
}
</script>

<template>
  <h1 class="text-2xl font-bold">Toutes les catégories</h1>
  <div class="my-xl">
    <input placeholder="search a categorie" type="text" v-model="recherche" @input="filter" class="border-b">
    <button @click="filter">Recherche</button>
    <div class="grid grid-cols-4">
      <div v-if="categories" v-for="categorie in resultat">
        <p>{{ categorie.categorie.name }}</p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>