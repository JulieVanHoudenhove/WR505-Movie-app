<script setup>
import { ref } from 'vue'
import router from "@/router";
import CreateCategoryView from "@/views/CreateCategoryView.vue";

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
    await fetch('http://localhost:8000/api/categories/' + props.category.id, {
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
  <div>
    <p>{{ category.name }}</p>
    <button @click="toggleForm = true" v-if="roles === 'ROLE_ADMIN'" :category="category">Modifier</button>
    <button
      @click="deleteCategory()"
      v-if="roles === 'ROLE_ADMIN' && category.movies.length === 0"
    >
      Supprimer
    </button>
  </div>
  <div v-if="toggleForm === true" class="bg-white">
    <CreateCategoryView @update-category="emit('updateCategory');toggleForm = false" :category="category" />
  </div>
</template>

<style scoped></style>