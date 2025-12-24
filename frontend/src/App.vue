<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router';
import router from './router';
import { useAuthStore } from './store/auth';
const authStore = useAuthStore();

onMounted(async () => {
  authStore.autoLogin();

});

</script>

<template>
  <RouterView />
</template>