<script setup>
import router from "@/router";
import { ref } from "vue";
import CreateActorView from "@/views/CreateActorView.vue";

defineProps({
  actor: {
    type: Object,
    required: true
  }
})

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const toggleForm = ref(false)
const emit = defineEmits(['updateActor'])

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

async function getNationality() {
  try {
    const response = await fetch('http://localhost:8000' + actor.nationality, {
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

function deleteActor() {
  const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet.te acteur.rice ?');
  if (isConfirmed) {
    fetch('http://localhost:8000/api/actors/' + props.actor.id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
        .then(response => {
          if (response.status === 401) {
            localStorage.removeItem('token')
            router.push('/login')
          }
          if (response.status === 204) {
            router.push('/actors')
          }
        })
        .catch(error => {
          console.error('Une erreur s\'est produite', error)
        })
  }
}

</script>

<template>
  <div>
    <router-link :to="`/actor/`+ actor.id">
      <img v-if="actor.filename" :src="'http://localhost:8000/images/actors/'+actors.filename" :alt="'photo ' + actor.firstName + ' ' + actor.lastName">
      <p>{{ actor.firstName }} {{ actor.lastName }}</p>
      <p>Récompense : {{ actor.reward }}</p>
      <p>Nationalité : {{ actor.nationality }}</p>
    </router-link>
    <button @click="toggleForm = true" v-if="roles === 'ROLE_ADMIN'">Modifier</button>
    <button @click="deleteActor()" v-if="roles === 'ROLE_ADMIN'">Supprimer</button>
  </div>
  <div v-if="toggleForm">
    <CreateActorView @update-actor="emit('updateActor'); toggleForm = false" :actor="actor" />
  </div>
</template>

<style scoped></style>