<script setup>
import { ref, onMounted } from 'vue'
import router from "@/router";

const token = localStorage.getItem('token')
if (!token) {
  router.push('/login')
}

const props = defineProps({
  category: {
    type: Object,
    required: false
  }
})

let loading = ref(false)

let categoryName = ref('')

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles;

if (!roles.includes('ROLE_ADMIN')) {
  router.push('/')
}

const emit = defineEmits(['createCategory', 'updateCategory'])

onMounted(() => {
  loading.value = true

  if (props.category) {
    categoryName.value = props.category.name
  }
})

let formData = new FormData()

async function createCategory() {
  formData.append('name', categoryName.value)
  try {
    const response = await fetch('http://localhost:8000/api/categories', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      await router.push('/categories')
    }
    emit('createCategory')
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

async function updateCategory() {
  formData.append('name', categoryName.value)
  try {
    const response = await fetch('http://localhost:8000/api/categories/' + props.category.id, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    })
    const data = await response.json()
    if (data.code === 401) {
      localStorage.removeItem('token')
      return router.push('/login')
    } else {
      await router.push('/categories')
    }
    emit('updateCategory')
  } catch (error) {
    console.error('Une erreur s\'est produite', error)
  }
}

</script>

<template>
  <div v-if="roles.includes('ROLE_ADMIN')" class="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
    <h1 v-if="category" class="text-2xl font-bold">Modifier une catégorie</h1>
    <h1 v-else class="text-2xl font-bold">Créer une catégorie</h1>
  </div>
  <div class="flex flex-col items-center justify-center p-5">
    <form class="flex flex-col gap-5 items-center" @submit.prevent="category ? updateCategory() : createCategory()" v-if="loading">
      <div class="flex gap-5 items-center">
        <label for="categoryName">Nom de la catégorie</label>
        <input type="text" class="border-b rounded-md" id="categoryName" v-model="categoryName">
      </div>
      <div class="flex gap-5 items-center">
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-if="category" type="submit">Modifier</button>
        <button class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" v-else type="submit">Créer</button>
      </div>
    </form>
  </div>
</template>

<style></style>