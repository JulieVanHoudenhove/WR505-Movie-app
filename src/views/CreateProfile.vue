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

let email = ref('')
let password = ref('')
let confirmPassword = ref('')

const emit = defineEmits(['updateProfile'])

onMounted(async () => {
  loading.value = true;

  if (props.user) {
    email.value = props.user.email
  }
});

let formData = new FormData();

async function editUser() {
  formData.append('email', email.value);
  formData.append('password', password.value);

  try {
    const response = await fetch('http://localhost:8000/api/me/update', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      await router.push('/profile')
    }
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
        <input type="email" id="email" v-model="email">
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password">
      </div>
      <div>
        <label for="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword">
      </div>
      <div>
        <button type="submit">Create</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>