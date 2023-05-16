import confetti from 'canvas-confetti'
import type { BlockState, TravleCallback } from '~/types'
import { randomInRange } from '~/utils/fn'

export class Play {
  status: Ref<'playing' | 'win' | 'lose'>
  width: Ref<number>
  height: Ref<number>
  totalMines: Ref<number>
  currentMines: Ref<number>
  unknowMines: Ref<number>
  blocks: Ref<BlockState[][]>
  animate: boolean
  constructor(width: number, height: number, totalMines: number) {
    this.status = ref('playing')
    this.width = ref(width)
    this.height = ref(height)
    this.totalMines = ref(totalMines)
    this.unknowMines = ref(totalMines)
    this.currentMines = ref(0)
    this.animate = false
    this.blocks = ref(
      Array.from({ length: this.width.value }, (_, y) =>
        Array.from(
          { length: this.height.value },
          (_, x): BlockState => ({
            x,
            y,
            adjacent: 0,
            revealed: false,
            mine: false,
          }),
        ),
      ),
    )

    this.addListeners()

    this.generateMines()
    this.updateAdjacentNumber()
  }

  get state() {
    return {
      width: this.width,
      height: this.height,
      status: this.status,
      totalMines: this.totalMines,
      currentMines: this.currentMines,
      unknowMines: this.unknowMines,
      blocks: this.blocks,
      animate: this.animate,
    }
  }

  reset() {
    this.status.value = 'playing'
    this.unknowMines.value = this.totalMines.value
    this.currentMines.value = 0
    this.blocks.value = Array.from({ length: this.width.value }, (_, y) =>
      Array.from(
        { length: this.height.value },
        (_, x): BlockState => ({
          x,
          y,
          adjacent: 0,
          revealed: false,
          mine: false,
        }),
      ),
    )

    this.generateMines()
    this.updateAdjacentNumber()
  }

  travelBlocks(cb: TravleCallback) {
    this.blocks.value.forEach((row, y) => {
      row.forEach((block, x) => {
        cb(block, x, y)
      })
    })
  }

  onClick(block: BlockState) {
    if (this.status.value !== 'playing')
      return

    if (block.mine) {
      block.revealed = true
      this.status.value = 'lose'
      return
    }

    if (block.adjacent === 0)
      this.expandZero(block)
    else block.revealed = true
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    if (this.status.value !== 'playing')
      return

    block.flagged = !block.flagged
    if (block.flagged) {
      if (block.mine)
        this.unknowMines.value--
    }
  }

  generateMines() {
    while (this.totalMines.value > this.currentMines.value) {
      const x = Math.floor(Math.random() * this.width.value)
      const y = Math.floor(Math.random() * this.height.value)
      const block = this.blocks.value[x][y]
      if (!block.mine) {
        block.mine = true
        this.currentMines.value++
      }
    }
  }

  updateAdjacentNumber() {
    this.travelBlocks((block, x, y) => {
      if (block.mine)
        return

      let adjacent = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const targetX = x + j
          const targetY = y + i
          if (
            targetX < 0
            || targetX >= this.width.value
            || targetY < 0
            || targetY >= this.height.value
            || (targetX === x && targetY === y)
          )
            continue

          if (this.blocks.value[targetY][targetX].mine)
            adjacent++
        }
      }

      block.adjacent = adjacent
    })
  }

  expandZero(block: BlockState) {
    if (block.revealed)
      return

    block.revealed = true
    if (block.adjacent === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const targetX = block.x + j
          const targetY = block.y + i
          if (
            targetX < 0
            || targetX >= this.width.value
            || targetY < 0
            || targetY >= this.height.value
            || (targetX === block.x && targetY === block.y)
          )
            continue
          this.expandZero(this.blocks.value[targetY][targetX])
        }
      }
    }
  }

  addListeners() {
    watchEffect(() => {
      if (this.unknowMines.value === 0)
        this.status.value = 'win'
    })
    watchEffect(() => {
      if (this.status.value === 'win') {
        this.travelBlocks((block) => {
          if (!block.revealed)
            block.revealed = true
        })
        this.winAnimate()
      }
      else if (this.status.value === 'lose') {
        this.travelBlocks((block) => {
          if (block.mine)
            block.revealed = true
        })
      }
      else {
        if (this.animate)
          this.animate = false
      }
    })
  }

  winAnimate() {
    this.animate = true
    const duration = 15 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const interval: NodeJS.Timer = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0 || !this.animate) {
        this.animate = false
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }),
      )
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }),
      )
    }, 250)
  }
}
