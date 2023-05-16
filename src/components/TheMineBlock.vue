<script setup lang="ts">
import type { BlockState } from '~/types'

defineProps<{
  state: BlockState
  dev: Boolean
}>()

const colorList = [
  'text-gray-500',
  'text-purple-500',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-pink-500',
  'text-indigo-500',
]
function getBlockColor(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  if (block.mine)
    return 'bg-red-500'

  return colorList[block.adjacent - 1]
}
</script>

<template>
  <div :class="getBlockColor(state)" flex="~" border="1 gray-400/10" h-10 w-10 cursor-pointer items-center justify-center>
    <template v-if="state.revealed || dev">
      <template v-if="state.mine">
        <div i-mdi-mine />
      </template>
      <template v-else>
        <div font-600>
          {{ state.adjacent }}
        </div>
      </template>
    </template>
    <template v-else-if="state.flagged">
      <div i-mdi-flag text-red />
    </template>
  </div>
</template>
