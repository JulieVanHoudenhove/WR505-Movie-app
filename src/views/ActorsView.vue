<script setup>
import { onMounted, ref } from 'vue'
import Actor from '@/components/Actor.vue'
import router from "@/router";
import CreateActorView from "@/views/CreateActorView.vue";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const toggleForm = ref(false)

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

let actors = ref([])
let recherche = ref('')
let nextPage = ref('')
let previousPage = ref('')

onMounted(async () => {
  await getActors()
})

async function getActors() {
  try {
    const response = await fetch('http://localhost:8000/api/actors', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      actors.value = data['hydra:member'];
      nextPage.value = data['hydra:view']['hydra:next'];
      previousPage.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function searchActor() {
  try {
    const response = await fetch('http://localhost:8000/api/actors?lastName=' + recherche.value, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      actors.value = data['hydra:member'];
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
      actors.value = data['hydra:member'];
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
      actors.value = data['hydra:member'];
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
    <h1 class="text-4xl text-center p-10 font-bold">Tous les acteurs.rices</h1>
    <div class="flex gap-7 flex-col justify-center items-center m-10">
      <div class="flex flex-col md:flex-row items-center gap-5">
        <input placeholder="rechercher un.e acteur.rice" type="text" v-model="recherche" @input="searchActor" class="border-b rounded-md">
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="searchActor">Recherche</button>
      </div>
      <button class="block w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5 text-center" v-if="roles === 'ROLE_ADMIN'" @click="toggleForm = !toggleForm">Ajouter un.e acteur.rice</button>
      <div v-if="toggleForm === true" class="relative">
        <div class="relative bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:bg-gray-700">
          <CreateActorView @create-actor="getActors(); toggleForm = false" />
        </div>
      </div>
    </div>
    <div class="my-xl">
      <div class="flex flex-col justify-center items-center 2xl:grid 2xl:grid-cols-2 gap-10">
        <div v-if="actors" v-for="actor in actors">
          <Actor @update-actor="getActors()" @delete-actor="getActors()" :actor="actor" />
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