<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <div>
      <button m-3 mt-8 text-sm btn @click="router.push('/minesweeper')">
        Play Minesweeper
      </button>
      <button m-3 mt-8 text-sm btn @click="router.push('/plum')">
        Play Plum
      </button>
    </div>

    <router-view />

    <TheFooter />
  </main>
</template>
