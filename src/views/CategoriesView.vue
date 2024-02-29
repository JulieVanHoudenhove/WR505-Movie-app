<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const toggleForm = ref(false)

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

let categories = ref([])
let recherche = ref('')
let nextPage = ref('')
let previousPage = ref('')

onMounted(async () => {
  await getCategories()
})

async function getCategories() {
  try {
    const response = await fetch('http://localhost:8000/api/categories', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      nextPage.value = data['hydra:view']['hydra:next'];
      previousPage.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function searchCategory() {
  try {
    const response = await fetch('http://localhost:8000/api/categories?name=' + recherche.value, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      nextPage.value = data['hydra:view']['hydra:next'];
      previousPage.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function pagePrevious() {
  try {
    const response = await fetch('http://localhost:8000' + previousPage.value, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      nextPage.value = data['hydra:view']['hydra:next'];
      previousPage.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function pageNext() {
  try {
    const response = await fetch('http://localhost:8000' + nextPage.value, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      nextPage.value = data['hydra:view']['hydra:next'];
      previousPage.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

</script>

<template>
  <h1>Toutes les categories</h1>
  <div class="my-xl">
    <input placeholder="search a category" type="text" v-model="recherche" @input="searchCategory" class="border-b">
    <button @click="searchCategory">Recherche</button>
    <div>
      <button v-if="roles === 'ROLE_ADMIN'" @click="toggleForm = true">Ajouter une catégorie</button>
      <div v-if="toggleForm">
        <CreateCategoryView @updateCategory="getCategories(); toggleForm = false" />
      </div>
    </div>
    <div class="grid grid-cols-4">
      <div v-if="categories" v-for="category in categories">
        <p>{{ category.name }}</p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
  <div class="flex justify-between">
    <button v-if="previousPage" @click="pagePrevious()">Précédent</button>
    <button v-else disabled>Précédent</button>
    <button v-if="nextPage" @click="pageNext()">Suivant</button>
    <button v-else disabled>Suivant</button>
  </div>
</template>

<style scoped></style>
