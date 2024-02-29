<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";

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
    const response = await fetch('http://localhost:8000/api/nationalities?pagination=false', {
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
    const response = await fetch('http://localhost:8000/api/actors', {
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
    const response = await fetch('http://localhost:8000/api/actors/' + props.actor.id, {
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
  <div v-if="roles.includes('ROLE_ADMIN')">
    <h1 v-if="actor" class="text-2xl font-bold">Modifier un acteur</h1>
    <h1 v-else class="text-2xl font-bold">Créer un acteur</h1>
    <form @submit.prevent="actor ? updateActor() : createActor()" v-if="loading">
      <div class="my-xl">
        <label for="actorFirstName">Prénom</label>
        <input type="text" v-model="actorFirstName" id="actorFirstName" class="border-b">
      </div>
      <div class="my-xl">
        <label for="actorLastName">Nom</label>
        <input type="text" v-model="actorLastName" id="actorLastName" class="border-b">
      </div>
      <div class="my-xl">
        <label for="actorReward">Récompense</label>
        <input type="text" v-model="actorReward" id="actorReward" class="border-b">
      </div>
      <div class="my-xl">
        <label for="actorNationality">Nationalité</label>
        <select v-if="nationalities" v-model="actorNationality" id="actorNationality" class="border-b">
          <option v-for="nationality in nationalities" :value="nationality['@id']" :key="nationality['id']">{{ nationality.nationality }}</option>
        </select>
      </div>
      <div class="my-xl">
        <label for="actorFilename">Photo</label>
        <input type="file" id="actorFilename" name="actorFilename" accept="image/png, image/jpeg" @change="fileChange">
      </div>
      <div class="my-xl">
        <button v-if="actor" type="submit">Modifier</button>
        <button v-else type="submit">Créer</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
