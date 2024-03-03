<script setup>
import router from "@/router";
import {onMounted, ref} from 'vue'

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
  fetch('http://localhost:8000/api/login_check', {
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
    router.push('/')
  })
}
</script>

<template>
<h1>Connexion</h1>
  <p v-if="reconnexionMessage">{{ reconnexionMessage }}</p>
  <p v-if="message">{{ message }}</p>
<div>
  <div>
    <label for="email">Email</label>
    <input type="email" id="email" v-model="email" class="border-b">
  </div>
  <div>
    <label for="password">Mot de passe</label>
    <input type="password" id="password" v-model="password" class="border-b">
  </div>
  <button @click="login">Connexion</button>
</div>
</template>

<style></style>