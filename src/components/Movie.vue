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
const emit = defineEmits(['updateMovie'])

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

function updateMovie() {

}

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
        router.push('/movies')
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
    <router-link :to="`/movie/`+ movie.id">
      <img src="https://source.unsplash.com/random/150x200/?film">
      <h2>Titre : {{ movie.title }}</h2>
      <p>Description : {{ movie.description }}</p>
      <p>Durée : {{ movie.duration }}</p>
      <p>Date de sortie : {{ moment(movie.releaseDate).format('DD/MM/YYYY') }}</p>
    </router-link>
      <button @click="toggleForm = true" v-if="roles === 'ROLE_ADMIN'">Modifier</button>
      <button @click="deleteMovie()" v-if="roles === 'ROLE_ADMIN'">Supprimer</button>
  </div>
  <div v-if="toggleForm === true" class="bg-white">
    <CreateMovieView @update-movie="emit('updateMovie'); toggleForm = false" :movie="movie" />
  </div>
</template>

<style scoped></style>
