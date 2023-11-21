<script setup>
import moment from 'moment'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div>
    <router-link :to="`/movie/`+ movie.id">
      <img src="https://source.unsplash.com/random/150x200/?film">
      <h2>Titre : {{ movie.title }}</h2>
      <p>Description : {{ movie.description }}</p>
      <p>Durée : {{ movie.duration }}</p>
      <p>Date de sortie : {{ moment(movie.release_date).format('DD/MM/YYYY') }}</p>
    </router-link>
  </div>
</template>

<style scoped></style>
```