<script setup>
import { onMounted, ref } from "vue"
import router from "@/router";
import CreateProfile from "@/views/CreateProfile.vue";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
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
    const response = await fetch(API_URL + '/api/me', {
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
  <div class="px-20 lg:px-30 xl:px-40">
    <h1 class="text-4xl text-center p-10 font-bold">Profil</h1>
    <div class="my-xl flex flex-col items-center gap-7">
      <div class="flex flex-col items-center gap-5">
        <p><span class="font-bold text-lg">Username : </span>{{ user.username }}</p>
        <p><span class="font-bold text-lg">Email : </span>{{ user.email }}</p>
      </div>
      <button class=" w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="toggleForm = !toggleForm">Edit</button>
      <div v-if="toggleForm === true" class="relative">
        <div class="relative bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:bg-gray-700">
          <CreateProfile @update-profile="getUser(); toggleForm = false" :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>