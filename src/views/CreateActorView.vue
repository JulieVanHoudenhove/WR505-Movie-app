<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const props = defineProps({
  actor: {
    type: Object,
    required: false
  }
})

let loading = ref(false)

let actorFirstName = ref('John')
let actorLastName = ref('Doe')
let actorReward = ref('Oscar')
let actorMovies = ref([])
let movies = ref([])
let nationalities = ref([])
let actorNationality = ref('')

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles;

if (!roles.includes('ROLE_ADMIN')) {
  router.push('/')
}

const emit = defineEmits(['updateActor', "createActor"])

onMounted(async () => {
  await getNationality();
  loading.value = true;

  if (props.actor) {
    actorFirstName.value = props.actor.firstName
    actorLastName.value = props.actor.lastName
    actorReward.value = props.actor.reward
    actorNationality.value = props.actor.nationality['@id']
  }
});

async function getNationality() {
  try {
    const response = await fetch(API_URL + '/api/nationalities?pagination=false', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      nationalities.value = data['hydra:member'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

let formData = new FormData();
let fileChange = (e) => {
  formData.append('file', e.target.files[0]);
}

async function createActor() {
  formData.append('firstName', actorFirstName.value);
  formData.append('lastName', actorLastName.value);
  formData.append('reward', actorReward.value);
  formData.append('nationality', actorNationality.value);

  try {
    const response = await fetch(API_URL + '/api/actors', {
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
      await router.push('/actors')
    }
    emit('createActor')
  } catch (error) {
    console.error('Erreur lors de la création de l\'acteur :', error);
  }
}
async function updateActor() {
  formData.append('firstName', actorFirstName.value);
  formData.append('lastName', actorLastName.value);
  formData.append('reward', actorReward.value);
  formData.append('nationality', actorNationality.value);

  try {
    const response = await fetch(API_URL + '/api/actors/' + props.actor.id, {
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
      await router.push('/actors')
    }
    emit('updateActor')
  } catch (error) {
    console.error('Erreur lors de la modification de l\'acteur :', error);
  }
}

</script>

<template>
  <div v-if="roles.includes('ROLE_ADMIN')" class="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
    <h1 v-if="actor" class="text-2xl font-bold">Modifier un acteur</h1>
    <h1 v-else class="text-2xl font-bold">Créer un acteur</h1>
  </div>
  <div class="flex flex-col items-center justify-center p-5">
    <form class="flex flex-col gap-5 items-center" @submit.prevent="actor ? updateActor() : createActor()" v-if="loading">
      <div class="flex gap-5 items-center">
        <label for="actorFirstName">Prénom</label>
        <input type="text" v-model="actorFirstName" id="actorFirstName" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="actorLastName">Nom</label>
        <input type="text" v-model="actorLastName" id="actorLastName" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="actorReward">Récompense</label>
        <input type="text" v-model="actorReward" id="actorReward" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="actorNationality">Nationalité</label>
        <select v-if="nationalities" v-model="actorNationality" id="actorNationality" class="border-b rounded-md">
          <option v-for="nationality in nationalities" :value="nationality['@id']" :key="nationality['id']">{{ nationality.nationality }}</option>
        </select>
      </div>
      <div class="flex gap-5 items-center">
        <label for="actorFilename">Photo</label>
        <input type="file" id="actorFilename" name="actorFilename" accept="image/png, image/jpeg" @change="fileChange">
      </div>
      <div class="flex gap-5 items-center">
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="actor" type="submit">Modifier</button>
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-else type="submit">Créer</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
