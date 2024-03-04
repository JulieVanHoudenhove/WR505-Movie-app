<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";
import CreateCategoryView from "@/views/CreateCategoryView.vue";
import Category from "@/components/Category.vue";

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
  <div class="px-20 lg:px-30 xl:px-40">
    <h1 class="text-4xl text-center p-10 font-bold">Toutes les categories</h1>
    <div class="flex gap-7 flex-col justify-center items-center m-10">
      <div class="flex flex-col md:flex-row items-center gap-5">
        <input placeholder="rechercher un catégorie" type="text" v-model="recherche" @input="searchCategory" class="border-b rounded-md">
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="searchCategory">Recherche</button>
      </div>
      <button class="w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="roles === 'ROLE_ADMIN'" @click="toggleForm = true">Ajouter une catégorie</button>
    </div>
    <div class="my-xl">
      <div>
        <div v-if="toggleForm === true" class="bg-white">
          <CreateCategoryView @create-category="getCategories(); toggleForm = false" />
        </div>
      </div>
      <div class="flex flex-col justify-center items-center 2xl:grid 2xl:grid-cols-2 gap-10">
        <div v-if="categories" v-for="category in categories">
          <Category @update-category="getCategories()" @delete-category="getCategories()" :category="category" />
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>
    </div>
    <div class="flex my-16 justify-between">
      <button class="w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="previousPage" @click="pagePrevious()">Précédent</button>
      <button class="cursor-not-allowed w-fit min-h-[42px] hover:bg-[#D64343] hover:text-white rounded-md border border-[#D64343] bg-transparent text-[#D64343] px-5" v-else disabled>Précédent</button>
      <button class="w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="nextPage" @click="pageNext()">Suivant</button>
      <button class="cursor-not-allowed w-fit min-h-[42px] hover:bg-[#D64343] hover:text-white rounded-md border border-[#D64343] bg-transparent text-[#D64343] px-5" v-else disabled>Suivant</button>
    </div>
  </div>
</template>

<style scoped></style>
