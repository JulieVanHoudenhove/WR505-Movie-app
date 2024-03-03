<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {onMounted, ref} from "vue";

const token = ref("")
onMounted(() => {
  token.value = localStorage.getItem('token')
  console.log(token)
})
</script>

<template>
  <header>
    <nav v-if="token" class="flex justify-between px-11">
      <div>
        <RouterLink to="/">Home | </RouterLink>
        <RouterLink to="/movies">Movies | </RouterLink>
        <RouterLink to="/actors">Actors | </RouterLink>
        <RouterLink to="/categories">Categories | </RouterLink>
        <RouterLink to="/profile">Profile | </RouterLink>
      </div>
      <div>
        <RouterLink to="/logout">Logout</RouterLink>
      </div>
    </nav>
    <nav v-else>
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
