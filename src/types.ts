export interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged?: boolean
  adjacent: number
}

export type TravleCallback = (block: BlockState, x: number, y: number) => void
