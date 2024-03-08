<script setup>
import router from "@/router";
import { ref } from "vue";
import CreateActorView from "@/views/CreateActorView.vue";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const props = defineProps({
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
const emit = defineEmits(['updateActor', 'deleteActor'])

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

function deleteActor() {
  const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet.te acteur.rice ?');
  if (isConfirmed) {
    fetch( API_URL + '/api/actors/' + props.actor.id, {
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
        emit('deleteActor')
      }
    })
    .catch(error => {
      console.error('Une erreur s\'est produite', error)
    })
  }
}

</script>

<template>
  <div v-if="actor" class="rounded-[15px] max-w-[600px] p-5 border border-[rgba(0,0,0,0.14)] shadow-[0_0_10px_rgba(0,0,0,0.2)] flex flex-col gap-7">
    <router-link class="flex flex-col md:flex-row gap-7" :to="`/actor/`+ actor.id">
      <img class="h-[310px] rounded-md object-cover" v-if="actor.filename" :src="API_URL +actor.filename" :alt="'photo ' + actor.firstName + ' ' + actor.lastName">
      <div class="flex flex-col justify-between gap-7">
        <div>
          <p><span class="font-bold text-lg">Prénom : </span>{{ actor.firstName }}</p>
          <p><span class="font-bold text-lg">Nom : </span>{{ actor.lastName }}</p>
          <p><span class="font-bold text-lg">Récompense : </span>{{ actor.reward }}</p>
          <p><span class="font-bold text-lg">Nationalité : </span>{{ actor.nationality.nationality }}</p>
        </div>
      </div>
    </router-link>
      <div class="flex gap-10 justify-end">
        <button class=" w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="toggleForm = !toggleForm" v-if="roles === 'ROLE_ADMIN'">Modifier</button>
        <button class=" w-fit min-h-[42px] hover:bg-[#D64343] hover:text-white rounded-md border border-[#D64343] bg-transparent text-[#D64343] px-5" @click="deleteActor()" v-if="roles === 'ROLE_ADMIN'">Supprimer</button>
      </div>
  </div>
  <div v-if="toggleForm === true" class="relative">
    <div class="relative bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:bg-gray-700">
      <CreateActorView @update-actor="emit('updateActor'); toggleForm = false" :actor="actor" />
    </div>
  </div>
</template>

<style scoped></style>