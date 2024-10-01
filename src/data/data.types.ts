export type GameState = Record<string, string | number>

export interface GameOption {
  id: string
  sceneId: string
  nextSceneId?: string
  description: string
  stateUpdate?: GameState
  hasBeenPicked: boolean
}

export interface GameScene {
  id: string
  prevSceneId?: string
  description: string
}

export interface Game {
  id: string
  name: string
  gameState?: GameState
  currentSceneId?: string
  stylePrompt: string
  systemPrompt: string
  createdAt: string
  updatedAt: string
}
