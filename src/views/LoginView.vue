<script setup>
import router from "@/router";
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
    console.log(data)
    // On redirige vers la page d'accueil
    router.push('/')
  })
}
</script>

<template>
<h1>Connexion</h1>
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