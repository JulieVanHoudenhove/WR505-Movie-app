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
  <h1 class="text-2xl font-bold">Tous les acteurs</h1>
  <div class="my-xl">
    <input placeholder="search an actor" type="text" v-model="recherche" @input="searchActor" class="border-b">
    <button @click="searchActor">Recherche</button>
    <div>
      <button v-if="roles === 'ROLE_ADMIN'" @click="toggleForm = true">Ajouter un acteur</button>
      <div v-if="toggleForm === true" class="bg-white">
        <CreateActorView @create-actor="getActors(); toggleForm = false" />
      </div>
    </div>
    <div class="grid grid-cols-4">
      <div v-if="actors" v-for="actor in actors">
        <Actor @update-actor="getActors()" @delete-actor="getActors()" :actor="actor" />
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