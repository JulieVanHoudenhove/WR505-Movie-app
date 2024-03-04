<script setup>
import router from "@/router";
import {onMounted, ref} from 'vue'

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const message = ref("")
const reconnexionMessage = ref("")

onMounted(() => {
  message.value = localStorage.getItem('message')
  if (message.value) {
    localStorage.removeItem('message')
  }
  reconnexionMessage.value = localStorage.getItem('reconnexionMessage')
  if (reconnexionMessage.value) {
    localStorage.removeItem('reconnexionMessage')
  }
})
const login = () => {
  fetch(API_URL + '/api/login_check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // On transforme l'objet en JSON pour l'envoyer au serveur
    body: JSON.stringify({
      username: email.value,
      password: password.value
    })
  })
  .then(response => response.json())
  .then(data => {
    // On stocke le token dans le localStorage
    localStorage.setItem('token', data.token)
    localStorage.setItem('message', 'You have been logged in')
    // On redirige vers la page d'accueil
    location.href = '/'
  })
}
</script>

<template>
  <div class="my-10 px-20 lg:px-30 xl:px-40 flex flex-col items-center gap-7">
    <h1 class="text-2xl font-bold">Connexion</h1>
    <p v-if="reconnexionMessage">{{ reconnexionMessage }}</p>
    <p v-if="message">{{ message }}</p>
    <div class="my-xl flex flex-col items-center gap-7">
      <div class="flex gap-5 items-center">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" class="border-b rounded-md">
      </div>
      <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="login">Connexion</button>
    </div>
  </div>
</template>

<style></style>