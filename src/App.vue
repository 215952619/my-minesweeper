<script setup lang="ts">
interface BlockStatus {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flag?: boolean
  adjacent: number
}

const WIDTH = $ref(10)
const HEIGHT = $ref(10)
const totalMines = $ref(20)

const blocks = reactive(Array.from({ length: WIDTH }, (_, y) => Array.from({ length: HEIGHT }, (_, x): BlockStatus => ({ x, y, adjacent: 0, revealed: false, mine: false }))))

function onClick(block: BlockStatus) {
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
  blocks.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return

      let adjacent = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const targetX = x + i
          const targetY = y + j
          if (targetX < 0 || targetX >= WIDTH || targetY < 0 || targetY >= HEIGHT)
            continue

          if (blocks[targetX][targetY].mine) {
            adjacent++
          }
        }
      }

      block.adjacent = adjacent
    })
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
function getBlockColor(block: BlockStatus) {
  if (block.mine)
    return 'text-red-500'

  return colorList[block.adjacent - 1]
}

function expandZero(block: BlockStatus) {
  if (block.revealed)
    return

  block.revealed = true
  if (block.adjacent === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const targetX = block.x + i
        const targetY = block.y + j
        if (targetX < 0 || targetX >= WIDTH || targetY < 0 || targetY >= HEIGHT)
          continue

        expandZero(blocks[targetX][targetY])
      }
    }
  }
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <div v-for="row, y in blocks" :key="y" flex="~" item->
      <div v-for="block, x in row" :key="x">
        <button h-10 w-10 border hover:bg-gray @click="onClick(block)">
          <template v-if="block.revealed">
            <template v-if="block.mine">
              <div i-mdi-mine :class="getBlockColor(block)" />
            </template>
            <template v-else>
              <div :class="getBlockColor(block)">
                {{ block.adjacent }}
              </div>
            </template>
          </template>
        </button>
      </div>
    </div>

    <pre>{{ blocks }}</pre>
    <TheFooter />
  </main>
</template>
