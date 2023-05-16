<script setup lang="ts">
import { Play } from '~/composables/cors'
import { dev, toggleDev } from '~/composables/storage'

/**
 * easy 9 9 10
 * medium 16 16 40
 * hard 30 16 99
 */
const WIDTH = ref(10)
const HEIGHT = ref(10)
const totalMines = ref(5)
const play = new Play(WIDTH.value, HEIGHT.value, totalMines.value)

const state = play.state
</script>

<template>
  <div>
    <div>
      <span i-carbon-alarm />
    </div>
  </div>

  <div v-for="row, y in state.blocks.value" :key="y" flex="~" items-center justify-center>
    <div v-for="block, x in row" :key="x" flex="~" items-center justify-center>
      <TheMineBlock :state="block" :dev="dev" @click="play.onClick(block)" @contextmenu.prevent="play.onRightClick(block)" />
    </div>
  </div>

  <div flex="~" items-center justify-center gap-1>
    <button btn @click="toggleDev()">
      Debugger
    </button>
    <button btn @click="play.reset()">
      Reset
    </button>
  </div>

  <router-view />
</template>
