<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let categories = ref([])

onMounted(async () => {
  const categoryResponse = await fetch('http://localhost:8000/api/categories', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  if (categoryResponse.status === 401) {
    localStorage.removeItem('token')
    router.push('/login')
  }
  categories.value = await categoryResponse.json()
  console.log(categories.value)

  filter()
})

let resultat = ref([])
let recherche = ref('')

let filter = () => {
  resultat.value = categories.value
      .map((category, index) => ({ category, index }))
      .filter(({ category }) => category.name.toLowerCase().includes(recherche.value.toLowerCase()));
}
</script>

<template>
  <div>
    <h1>Categories</h1>
    <input placeholder="search a category" type="text" v-model="recherche" @input="filter" class="border-b">
    <button @click="filter">Recherche</button>
    <div class="grid grid-cols-4">
      <div v-if="categories" v-for="category in resultat">
        <p>{{ category.category.name }}</p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
