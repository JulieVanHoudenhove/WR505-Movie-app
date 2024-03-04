<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {onMounted, ref} from "vue";
import { initFlowbite } from 'flowbite'

const token = ref("")
onMounted(() => {
  token.value = localStorage.getItem('token')
  console.log(token)
  initFlowbite()
})

let activeLink = ref('/')
function setActiveLink(route) {
  this.activeLink = route;
}

</script>

<template>
  <header>
    <nav v-if="token" class="bg-white border-gray-200 shadow-[0_0_80px_rgba(0,0,0,.07)]">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/popcorn.png" class="h-14" alt="Movie App Logo" />
        </a>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <ul>
            <li class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md flex items-center border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5">
              <RouterLink to="/logout">Logout</RouterLink>
            </li>
          </ul>
          <button data-collapse-toggle="navbar-cta" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <RouterLink class="block py-2 px-3 md:p-0 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#D64343] md:dark:hover:text-[#D64343] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" to="/" :class="{ 'active': activeLink === '/' }" @click="setActiveLink('/')">Home</RouterLink>
            </li>
            <li>
              <RouterLink class="block py-2 px-3 md:p-0 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#D64343] md:dark:hover:text-[#D64343] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" :class="{ 'active': activeLink === '/movies' }" @click="setActiveLink('/movies')" to="/movies">Movies</RouterLink>
            </li>
            <li>
              <RouterLink class="block py-2 px-3 md:p-0 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#D64343] md:dark:hover:text-[#D64343] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" :class="{ 'active': activeLink === '/actors' }" @click="setActiveLink('/actors')" to="/actors">Actors</RouterLink>
            </li>
            <li>
              <RouterLink class="block py-2 px-3 md:p-0 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#D64343] md:dark:hover:text-[#D64343] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" :class="{ 'active': activeLink === '/categories' }" @click="setActiveLink('/categories')" to="/categories">Categories</RouterLink>
            </li>
            <li>
              <RouterLink class="block py-2 px-3 md:p-0 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#D64343] md:dark:hover:text-[#D64343] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" :class="{ 'active': activeLink === '/profile' }" @click="setActiveLink('/profile')" to="/profile">Profile</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <nav v-else class="bg-white border-gray-200 shadow-[0_0_80px_rgba(0,0,0,.07)]">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/popcorn.png" class="h-14" alt="Movie App Logo" />
        </a>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <ul>
            <li class="min-h-[42px] w-fit bg-[#D64343] text-white rounded-md flex items-center border border-[#D64343] hover:bg-transparent hover:text-[#D64343] px-5">
              <RouterLink to="/login">Login</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
a {
  text-decoration: none;
}
.active {
    @apply block py-2 px-3 md:p-0 text-white bg-[#D64343] rounded md:bg-transparent md:text-[#D64343] md:hover:text-[#D64343];
}
</style>
