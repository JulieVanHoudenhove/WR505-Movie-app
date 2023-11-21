<script setup>
import router from "@/router";
const logout = () => {
  // On stocke le token dans le localStorage
  localStorage.removeItem('token')
  localStorage.setItem('message', 'You have been logged out')
  // On redirige vers la page d'accueil
  router.push('/login')
}
logout()
</script>

<template>

</template>

<style></style>