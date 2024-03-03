<script setup>
import moment from 'moment'
import router from "@/router";
import { ref } from 'vue'
import CreateMovieView from "@/views/CreateMovieView.vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const toggleForm = ref(false)
const emit = defineEmits(['updateMovie', 'deleteMovie'])

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

function deleteMovie() {
  const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?');
  if (isConfirmed) {
    fetch('http://localhost:8000/api/movies/' + props.movie.id, {
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
        emit('deleteMovie')
      }
    })
    .catch(error => {
      console.error('Une erreur s\'est produite', error)
    })
  }
}

</script>

<template>
  <div class="rounded-[15px] max-w-[600px] p-5 border border-[rgba(0,0,0,0.14)] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
    <router-link class="flex flex-col md:flex-row gap-7" :to="`/movie/`+ movie.id">
      <img class="h-[310px] rounded-md object-cover" v-if="movie.filename" :src="'http://localhost:8000/images/movies/'+movie.filename" :alt="'affiche ' + movie.title">
      <div class="flex flex-col justify-between gap-7">
        <div>
          <p><span class="font-bold text-lg">Titre : </span>{{ movie.title }}</p>
          <p><span class="font-bold text-lg">Description : </span>{{ movie.description }}</p>
          <p><span class="font-bold text-lg">Durée : </span>{{ movie.duration }}</p>
          <p><span class="font-bold text-lg">Date de sortie : </span>{{ moment(movie.releaseDate).format('DD/MM/YYYY') }}</p>
        </div>
        <div class="flex gap-10">
          <button class=" w-fit h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="toggleForm = true" v-if="roles === 'ROLE_ADMIN'">Modifier</button>
          <button class=" w-fit h-[42px] hover:bg-[#D64343] hover:text-white rounded-md border border-[#D64343] bg-transparent text-[#D64343] px-5" @click="deleteMovie()" v-if="roles === 'ROLE_ADMIN'">Supprimer</button>
        </div>
      </div>
    </router-link>
  </div>
  <div v-if="toggleForm === true" class="bg-white">
    <CreateMovieView @update-movie="emit('updateMovie'); toggleForm = false" :movie="movie" />
  </div>
</template>

<style scoped></style>
