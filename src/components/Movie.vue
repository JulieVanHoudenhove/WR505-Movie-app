<script setup>

defineProps({
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
      <h2>{{ movie.title }}</h2>
      <p>{{ movie.description }}</p>
      <p>{{ movie.duration }}</p>
    </router-link>
  </div>
</template>

<style scoped></style>
```