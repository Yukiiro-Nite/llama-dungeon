import React from "react"
import { Game, GameOption, GameScene } from "../data/data.types"

export type LayerType = 'MainMenu' | 'NewGame' | 'LoadGame' | 'GameHistory' | 'SceneViewer'

export interface AppContext {
  layer: LayerType
  games: Game[]
  sceneLoading: boolean
  currentGame?: Game,
  currentScene?: GameScene
  currentOptions?: GameOption[]
  selectOption: (option: GameOption) => void
  setGame: (gameId: string) => void
  showMainMenu: () => void
  showNewGame: () => void
  showLoadGame: () => void
  showGameHistory: () => void
  showSceneViewer: () => void
  createGame: (game: Partial<Game>) => Promise<Game | undefined>
  updateGame: (game: Partial<Game>) => Promise<Game | undefined>
  removeGame: (gameId: string) => Promise<boolean>
}

export const appContext = React.createContext<AppContext>({
  layer: 'MainMenu',
  games: [],
  sceneLoading: false,
  currentGame: undefined,
  currentScene: undefined,
  currentOptions: undefined,
  selectOption: () => { throw new Error('Function not implmented') },
  setGame: () => { throw new Error('Function not implmented') },
  showMainMenu: () => { throw new Error('Function not implmented') },
  showNewGame: () => { throw new Error('Function not implmented') },
  showLoadGame: () => { throw new Error('Function not implmented') },
  showGameHistory: () => { throw new Error('Function not implmented') },
  showSceneViewer: () => { throw new Error('Function not implmented') },
  createGame: () => { throw new Error('Function not implmented') },
  updateGame: () => { throw new Error('Function not implmented') },
  removeGame: () => { throw new Error('Function not implmented') },
})