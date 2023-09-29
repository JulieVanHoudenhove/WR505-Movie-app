<script setup>

defineProps({
  actor: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div>
    <router-link :to="`/actor/`+ actor.id">
      <img src="https://source.unsplash.com/random/150x200/?actor">
      <p>{{ actor.firstName }} {{ actor.lastName }}</p>
    </router-link>
  </div>
</template>

<style scoped></style>