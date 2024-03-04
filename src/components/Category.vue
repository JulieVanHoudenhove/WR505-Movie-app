<script setup>
import { ref } from 'vue'
import router from "@/router";
import CreateCategoryView from "@/views/CreateCategoryView.vue";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
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

const toggleForm = ref(false)
const emit = defineEmits(['deleteCategory'])

const decodeToken = JSON.parse(atob(token.split('.')[1]));
const roles = decodeToken.roles[0];

async function deleteCategory() {
  const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
  if (isConfirmed) {
    await fetch( API_URL+ '/api/categories/' + props.category.id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
        .then(response => {
          if (response.status === 401) {
            localStorage.removeItem('token')
            router.push('/login')
          }
          if (response.status === 204) {
            emit('deleteCategory')
          }
        })
        .catch(error => {
          console.error('Une erreur s\'est produite', error)
        })
  }
}

</script>

<template>
  <div v-if="category" class="flex flex-col items-center gap-7 rounded-[15px] max-w-[600px] p-5 border border-[rgba(0,0,0,0.14)] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
    <p>{{ category.name }}</p>
    <div class="flex justify-between gap-10">
      <button class=" w-fit min-h-[42px] bg-[#D64343] text-white rounded-md border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5" @click="toggleForm = !toggleForm" v-if="roles === 'ROLE_ADMIN'" :category="category">Modifier</button>
      <button class=" w-fit min-h-[42px] hover:bg-[#D64343] hover:text-white rounded-md border border-[#D64343] bg-transparent text-[#D64343] px-5" @click="deleteCategory()" v-if="roles === 'ROLE_ADMIN' && category.movies.length === 0"    >Supprimer</button>
    </div>
  </div>
  <div v-if="toggleForm === true" class="relative">
    <div class="relative bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:bg-gray-700">
      <CreateCategoryView @update-category="emit('updateCategory');toggleForm = false" :category="category" />
    </div>
  </div>
</template>

<style scoped></style>