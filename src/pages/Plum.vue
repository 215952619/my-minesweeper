<script setup lang="ts">
import { randomInRange } from '~/utils/fn'

interface Point {
  x: number
  y: number
}

interface Branch {
  start: Point
  angle: number
  length: number
}

type Range = [number, number]

const RangeGroup: { [key: string]: Range } = {
  left: [1.5, 2],
  right: [1.0, 1.5],
}

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
const maxLevel = ref(5)
const maxLineLength = ref(60)
const minLineLength = ref(10)

onMounted(() => {
  ctx = canvas.value!.getContext('2d')!

  start({ x: 0, y: 300 }, RangeGroup.left)
  start({ x: 400, y: 300 }, RangeGroup.right)
  start({ x: 200, y: 400 }, RangeGroup.left)
})

function start(point: Point, group: [number, number]) {
  const branch = randomBranch(point, group[0], group[1])
  drawPlum(branch, maxLevel.value)
}

function drawPlum(branch: Branch, level: number) {
  let callbacks = []
  callbacks.push(() => drawBranch(branch, maxLevel.value))

  while (level || callbacks.length > 0) {
    const cbs = [...callbacks]
    callbacks = []
    for (const cb of cbs)
      cb()

    level--
  }
}

function drawBranch(branch: Branch, level = 0) {
  if (level === 0)
    return
  const end = {
    x: branch.start.x + branch.length * Math.cos(branch.angle),
    y: branch.start.y + branch.length * Math.sin(branch.angle),
  }
  drawLine(branch.start, end)

  const left = randomBranch(end, ...RangeGroup.left)
  const right = randomBranch(end, ...RangeGroup.right)
  drawBranch(left, level - 1)
  drawBranch(right, level - 1)
}

function drawLine(p1: Point, p2: Point, lineWidth = 1, strokeStyle = 'rgb(255,255,255)') {
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = strokeStyle
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function randomBranch(point: Point, minAngle: number, maxAngle: number): Branch {
  return {
    start: point,
    angle: Math.PI * randomInRange(minAngle, maxAngle),
    length: randomInRange(minLineLength.value, maxLineLength.value),
  }
}
</script>

<template>
  <div flex="~" justify-center>
    <canvas ref="canvas" h-400px w-400px :width="400" :height="400" border />
  </div>
</template>
