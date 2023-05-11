<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged?: boolean
  adjacent: number
}

type TravleCallback = (block: BlockState, x: number, y: number) => void

const dev = false
const WIDTH = $ref(10)
const HEIGHT = $ref(10)
const totalMines = $ref(5)

const blocks = reactive(Array.from({ length: WIDTH }, (_, y) => Array.from({ length: HEIGHT }, (_, x): BlockState => ({ x, y, adjacent: 0, revealed: false, mine: false }))))

function travelBlocks(cb: TravleCallback) {
  blocks.forEach((row, y) => {
    row.forEach((block, x) => {
      cb(block, x, y)
    })
  })
}

function onClick(block: BlockState) {
  if (block.mine) {
    block.revealed = true
    alert('你死了')
    return
  }

  if (block.adjacent === 0)
    expandZero(block)
  else
    block.revealed = true
}

function onRightClick(block: BlockState) {
  if (block.revealed)
    return

  block.flagged = !block.flagged
}

function generateMines() {
  let currentMines = 0
  while (totalMines > currentMines) {
    const x = Math.floor(Math.random() * WIDTH)
    const y = Math.floor(Math.random() * HEIGHT)
    const block = blocks[x][y]
    if (!block.mine) {
      block.mine = true
      currentMines++
    }
  }
}

generateMines()

function updateAdjacentNumber() {
  travelBlocks((block, x, y) => {
    if (block.mine)
      return

    let adjacent = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const targetX = x + j
        const targetY = y + i
        if (targetX < 0 || targetX >= WIDTH || targetY < 0 || targetY >= HEIGHT || (targetX === x && targetY === y))
          continue

        if (blocks[targetY][targetX].mine)
          adjacent++
      }
    }

    block.adjacent = adjacent
  })
}

updateAdjacentNumber()

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

function expandZero(block: BlockState) {
  if (block.revealed)
    return

  block.revealed = true
  if (block.adjacent === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const targetX = block.x + j
        const targetY = block.y + i
        if (targetX < 0 || targetX >= WIDTH || targetY < 0 || targetY >= HEIGHT || (targetX === block.x && targetY === block.y))
          continue

        expandZero(blocks[targetY][targetX])
      }
    }
  }
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <div v-for="row, y in blocks" :key="y" flex="~" items-center justify-center>
      <div v-for="block, x in row" :key="x" flex="~" items-center justify-center>
        <div :class="getBlockColor(block)" flex="~" border="1 gray-400/10" h-10 w-10 cursor-pointer items-center justify-center @click="onClick(block)" @contextmenu.prevent="onRightClick(block)">
          <template v-if="block.revealed || dev">
            <template v-if="block.mine">
              <div i-mdi-mine />
            </template>
            <template v-else>
              <div>
                {{ block.adjacent }}
              </div>
            </template>
          </template>
          <template v-else-if="block.flagged">
            <div i-mdi-flag text-red />
          </template>
        </div>
      </div>
    </div>

    <TheFooter />
  </main>
</template>
