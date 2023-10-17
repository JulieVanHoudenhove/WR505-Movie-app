<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home | </RouterLink>
        <RouterLink to="/movies">Movies | </RouterLink>
        <RouterLink to="/actors">Actors | </RouterLink>
        <RouterLink to="/categories">Categories | </RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
