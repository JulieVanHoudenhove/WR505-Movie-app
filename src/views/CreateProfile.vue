<script setup>
import { onMounted, ref } from 'vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const props = defineProps({
  user: {
    type: Object,
    required: false
  }
})

let loading = ref(false)

let userEmail = ref('')
let userName = ref('')
let userPassword = ref('')
let userConfirmPassword = ref('')

const emit = defineEmits(['updateProfile'])

onMounted(async () => {
  loading.value = true;

  if (props.user) {
    userEmail.value = props.user.email
    userName.value = props.user.username
  }
});

let formData = new FormData();

async function editUser() {
  formData.append('email', userEmail.value);
  formData.append('username', userName.value);
  formData.append('password', userPassword.value);

  try {
    const response = await fetch('http://localhost:8000/api/me/update', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      await router.push('/profile')
    }
    emit('updateProfile')
    localStorage.setItem('reconnexionMessage', 'You need to reconnect to see the changes on your profile.')
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

</script>

<template>
  <div class="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
    <h1 class="text-2xl font-bold">Éditer le profil</h1>
  </div>
  <div class="flex flex-col items-center justify-center p-5">
    <form class="flex flex-col gap-5 items-center" @submit.prevent="editUser()">
      <div class="flex gap-5 items-center">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="userEmail" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="userName" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="userPassword" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <label for="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" v-model="userConfirmPassword" class="border-b rounded-md">
      </div>
      <div class="flex gap-5 items-center">
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="userPassword === userConfirmPassword" type="submit">Update</button>
        <p v-else>Vos mots de passe ne coïncident pas</p>
      </div>
    </form>
  </div>
</template>

<style scoped></style>