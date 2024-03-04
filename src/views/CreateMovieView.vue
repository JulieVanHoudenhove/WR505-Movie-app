<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const props = defineProps({
  movie: {
    type: Object,
    required: false
  }
})

let loading = ref(false)

let movieCategory = ref('')
let movieTitle = ref('Title')
let movieDescription = ref('Lorem ipsum dolor sit amet, consectetur tincidunt.2')
let movieReleaseDate = ref('')
let movieDuration = ref(145)
let movieOnline = ref(true)
let movieNote = ref(4)
let movieEntries = ref(145)
let movieBudget = ref(145)
let movieDirector = ref('Directorzaada')
let movieWebsite = ref('http://oui.non')
let movieActors = ref([])
let actors = ref([])
let categories = ref([])
let movieImage = ref('')


const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles;

if (!roles.includes('ROLE_ADMIN')) {
  router.push('/')
}

const emit = defineEmits(['updateMovie', "createMovie"])

onMounted(async () => {
  await getCategories();
  await getActors();
  loading.value = true;

  if (props.movie) {
    movieCategory.value = props.movie.category
    movieTitle.value = props.movie.title
    movieDescription.value = props.movie.description
    movieReleaseDate.value = props.movie.releaseDate.split('T')[0]
    movieDuration.value = props.movie.duration
    movieOnline.value = props.movie.online
    movieNote.value = props.movie.note
    movieEntries.value = props.movie.entries
    movieBudget.value = props.movie.budget
    movieDirector.value = props.movie.director
    movieWebsite.value = props.movie.website
    movieActors.value = props.movie.actor.map(actor => actor['@id'])
  }
});

async function getCategories() {
  try {
    const response = await fetch(API_URL + '/api/categories?pagination=false', {
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
    const response = await fetch(API_URL + '/api/actors?pagination=false', {
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

let formData = new FormData();
let fileChange = (e) => {
  formData.append('file', e.target.files[0]);
}

async function createMovie() {
  formData.append('title', movieTitle.value);
  formData.append('description', movieDescription.value);
  formData.append('releaseDate', movieReleaseDate.value);
  formData.append('duration', movieDuration.value);
  formData.append('category', movieCategory.value);
  formData.append('director', movieDirector.value);
  formData.append('entries', movieEntries.value);
  formData.append('budget', movieBudget.value);
  formData.append('website', movieWebsite.value);
  formData.append('note', movieNote.value);
  formData.append('online', movieOnline.value);
  formData.append('actor', JSON.stringify(movieActors.value));

  try {
    const response = await fetch(API_URL + '/api/movies', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });
    const data = await response.json();
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      await router.push('/movies')
    }
    emit('createMovie')
  } catch (error) {
    console.error('Erreur lors de la création du film :', error);
  }
}
async function updateMovie() {
  formData.append('title', movieTitle.value);
  formData.append('description', movieDescription.value);
  formData.append('releaseDate', movieReleaseDate.value);
  formData.append('duration', movieDuration.value);
  formData.append('category', movieCategory.value);
  formData.append('director', movieDirector.value);
  formData.append('entries', movieEntries.value);
  formData.append('budget', movieBudget.value);
  formData.append('website', movieWebsite.value);
  formData.append('note', movieNote.value);
  formData.append('online', movieOnline.value);
  formData.append('actor', JSON.stringify(movieActors.value));

  try {
    const response = await fetch(API_URL + '/api/movies/' + props.movie.id, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });
    const data = await response.json();
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      await router.push('/movies')
    }
    emit('updateMovie')
  } catch (error) {
    console.error('Erreur lors de la modification du film :', error);
  }
}

</script>

<template>
  <div v-if="roles.includes('ROLE_ADMIN')" class="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
    <h1 v-if="movie" class="text-2xl font-bold">Modifier un film</h1>
    <h1 v-else class="text-2xl font-bold">Créer un film</h1>
  </div>
  <div class="flex flex-col items-center justify-center p-5">
    <form class="flex flex-col gap-5 items-center" @submit.prevent="movie ? updateMovie() : createMovie()" v-if="loading">
      <div class="flex gap-5 items-center">
        <label for="movieTitle">Titre</label>
        <input type="text" v-model="movieTitle" id="movieTitle" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieDescription">Description</label>
        <textarea v-model="movieDescription" id="movieDescription" class="border-b rounded-md"></textarea>
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieReleaseDate">Date de sortie</label>
        <input type="date" v-model="movieReleaseDate" id="movieReleaseDate" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieDuration">Durée</label>
        <input type="number" v-model="movieDuration" id="movieDuration" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieCategory">Catégorie</label>
        <select v-if="categories" v-model="movieCategory" id="movieCategory" class="border-b rounded-md">
          <option v-for="category in categories" :value="category['@id']" :key="category['id']">{{ category.name }}</option>
        </select>
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieDirector">Réalisateur</label>
        <input type="text" v-model="movieDirector" id="movieDirector" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieEntries">Entrées</label>
        <input type="number" v-model="movieEntries" id="movieEntries" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieBudget">Budget</label>
        <input type="number" v-model="movieBudget" id="movieBudget" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieWebsite">Site web</label>
        <input type="text" v-model="movieWebsite" id="movieWebsite" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieRate">Note</label>
        <input type="number" v-model="movieNote" id="movieRate" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieOnline">En ligne</label>
        <select v-model="movieOnline" id="movieOnline" class="border-b rounded-md">
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieActors">Actors</label>
        <select multiple v-model="movieActors" id="movieActors" class="border-b rounded-md">
          <option v-for="actor in actors" :key="actor.id" :value="actor['@id']">{{ actor.firstName ? actor.firstName : 'loading..' }} {{ actor.lastName ? actor.lastName : 'loading...' }}</option>
        </select>
      </div>
      <div class="flex gap-5 items-center">
        <label for="movieFilename">Affiche</label>
        <input type="file" id="movieFilename" name="movieFilename" accept="image/png, image/jpeg" @change="fileChange">
      </div>
      <div class="flex gap-5 items-center">
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="movie" type="submit">Modifier</button>
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-else type="submit">Créer</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
