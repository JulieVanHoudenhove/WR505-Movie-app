<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let loading = ref(false)

let movieCategory = ref('')
let movieTitle = ref('')
let movieDescription = ref('')
let movieReleaseDate = ref('')
let movieDuration = ref('')
let movieOnline = ref(true)
let movieRate = ref('')
let movieEntries = ref('')
let movieBudget = ref('')
let movieDirector = ref('')
let movieWebsite = ref('')
let movieActors = ref([])
let actors = ref([])
let categories = ref([])

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles;

if (!roles.includes('ROLE_ADMIN')) {
  router.push('/')
}

onMounted(async () => {
  await getCategories();
  await getActors();
  loading.value = true;
  console.log(actors.value)
});

async function getCategories() {
  try {
    const response = await fetch('http://localhost:8000/api/categories', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function getActors() {
  try {
    const response = await fetch('http://localhost:8000/api/actors', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      actors.value = data['hydra:member'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function createMovie() {
  const body = {
    'title': `${movieTitle.value}`,
    'description': `${movieDescription.value}`,
    'releaseDate': `${movieReleaseDate.value}`,
    'duration': movieDuration.value,
    'category': movieCategory.value,
    'director': `${movieDirector.value}`,
    'entries': movieEntries.value,
    'budget': movieBudget.value,
    'website': `${movieWebsite.value}`,
    'rating': movieRate.value,
    'online': movieOnline.value,
    'actor': movieActors.value.map(actor => 'http://localhost:8000/api/actors/' + actor),
  }

  try {
    const response = await fetch('http://localhost:8000/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      await router.push('/movies')
    }
  } catch (error) {
    console.error('Erreur lors de la création du film :', error);
  }
}


</script>

<template>
  <div v-if="roles.includes('ROLE_ADMIN')">
    <h1 class="text-2xl font-bold">Créer un film</h1>
    <form @submit.prevent="createMovie()" v-if="loading">
      <div class="my-xl">
        <label for="movieTitle">Titre</label>
        <input type="text" v-model="movieTitle" id="movieTitle" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieDescription">Description</label>
        <textarea v-model="movieDescription" id="movieDescription" class="border-b"></textarea>
      </div>
      <div class="my-xl">
        <label for="movieReleaseDate">Date de sortie</label>
        <input type="date" v-model="movieReleaseDate" id="movieReleaseDate" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieDuration">Durée</label>
        <input type="number" v-model="movieDuration" id="movieDuration" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieCategory">Catégorie</label>
        <select v-if="categories" v-model="movieCategory" id="movieCategory" class="border-b">
          <option v-for="category in categories" :value="category['@id']" :key="category['id']">{{ category.name }}</option>
        </select>
      </div>
      <div class="my-xl">
        <label for="movieDirector">Réalisateur</label>
        <input type="text" v-model="movieDirector" id="movieDirector" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieEntries">Entrées</label>
        <input type="number" v-model="movieEntries" id="movieEntries" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieBudget">Budget</label>
        <input type="number" v-model="movieBudget" id="movieBudget" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieWebsite">Site web</label>
        <input type="text" v-model="movieWebsite" id="movieWebsite" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieRate">Note</label>
        <input type="number" v-model="movieRate" id="movieRate" class="border-b">
      </div>
      <div class="my-xl">
        <label for="movieOnline">En ligne</label>
        <select v-model="movieOnline" id="movieOnline" class="border-b">
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
      </div>
      <div class="my-xl">
        <label for="movieActors">Actors</label>
        <select multiple v-model="movieActors" id="movieActors" class="border-b">
          <option v-for="actor in actors" :key="actor.id" :value="actor.id">{{ actor.firstName ? actor.firstName : 'loading..' }} {{ actor.lastName ? actor.lastName : 'loading...' }}</option>
        </select>
      </div>
      <div class="my-xl">
        <button type="submit">Créer</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
