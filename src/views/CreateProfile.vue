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
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

</script>

<template>
  <div>
    <h1>Éditer le profil</h1>
    <form @submit.prevent="editUser()">
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="userEmail">
      </div>
      <div>
        <label for="username">Username</label>
        <input type="text" id="username" v-model="userName">
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="userPassword">
      </div>
      <div>
        <label for="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" v-model="userConfirmPassword">
      </div>
      <div>
        <button v-if="userPassword === userConfirmPassword" type="submit">Update</button>
        <p v-else>Vos mots de passe ne coïncident pas</p>
      </div>
    </form>
  </div>
</template>

<style scoped></style>