<script setup>
import { onMounted, ref } from "vue"
import router from "@/router";
import CreateProfile from "@/views/CreateProfile.vue";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

let user = ref('')
const toggleForm = ref(false)

onMounted(async () => {
  await getUser()
})

async function getUser() {
  try {
    const response = await fetch('http://localhost:8000/api/me', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      user.value = data;
    }
  } catch (error) {
    console.error('Une erreur s\'est produite', error)}
}

</script>

<template>
  <div>
    <h1>Profile</h1>
    <p>{{ user.username }}</p>
    <p>{{ user.email }}</p>
    <button @click="toggleForm = true">Edit</button>
    <div v-if="toggleForm === true" class="bg-white">
      <CreateProfile @create-actor="getUser(); toggleForm = false" />
    </div>
  </div>
</template>

<style></style>