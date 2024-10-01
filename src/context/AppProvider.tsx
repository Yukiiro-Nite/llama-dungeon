import { ReactElement, useCallback, useEffect, useState } from "react"
import { appContext, LayerType } from "./AppContext"
import { Game, GameOption, GameScene } from "../data/data.types"
import * as GameStore from "../data/Game"
import * as SceneStore from "../data/GameScene"
import * as OptionStore from "../data/GameOption"
import { getMessageHistory } from "../data/history"
import { buildPrompt } from "../utils/prompts"
import { explore } from "../api/explore"
import { mergeGameStates } from "../utils/gameStateUtils"

export interface AppProviderProps {
  children: ReactElement | ReactElement[]
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [layer, setLayer] = useState<LayerType>('MainMenu')
  const [currentGame, _setGame] = useState<Game | undefined>()
  const [currentScene, _setScene] = useState<GameScene | undefined>()
  const [currentOptions, setOptions] = useState<GameOption[] | undefined>()
  const [games, setGames] = useState<Game[]>([])
  const [sceneLoading, setSceneLoading] = useState(false)
  const showMainMenu = useCallback(() => setLayer('MainMenu'), [])
  const showNewGame = useCallback(() => setLayer('NewGame'), [])
  const showLoadGame = useCallback(() => setLayer('LoadGame'), [])
  const showGameHistory = useCallback(() => setLayer('GameHistory'), [])
  const showSceneViewer = useCallback(() => setLayer('SceneViewer'), [])


  // Scene functions
  const setScene = useCallback(async (scene: GameScene) => {
    _setScene(scene)
    const options = await OptionStore.getSceneOptions(scene.id)
    setOptions(options)
  }, [])

  const fetchScene = useCallback(async (game: Game, option?: GameOption) => {
    setSceneLoading(true)
    const history = await getMessageHistory(game, option)
    const prompt = buildPrompt(game.stylePrompt, game.systemPrompt, game.gameState)
    try {
      const gameResponse = await explore(prompt, history)
      const newScene = await SceneStore.create({
        id: crypto.randomUUID(),
        prevSceneId: option?.sceneId,
        description: gameResponse.scene
      })

      if (!newScene) {
        console.error('Could not create new scene.')
        return
      }

      if (!gameResponse.options) {
        gameResponse.options = [{ description: 'continue', stateUpdate: {} }]
      }

      const newOptions = await Promise.all(gameResponse.options.map(o => OptionStore.create({
        id: crypto.randomUUID(),
        sceneId: newScene.id,
        description: o.description,
        stateUpdate: o.stateUpdate,
        hasBeenPicked: false
      })))
      const cleanedOptions = newOptions.filter(Boolean) as GameOption[]

      const updatedGame = await GameStore.update({
        id: game.id,
        currentSceneId: newScene.id,
        updatedAt: new Date().toISOString(),
        gameState: mergeGameStates([game.gameState ?? {}, option?.stateUpdate ?? {}])
      })

      if (option) {
        await OptionStore.update({ id: option.id, hasBeenPicked: true, nextSceneId: newScene.id })
      }

      _setGame(updatedGame)
      _setScene(newScene)
      setOptions(cleanedOptions)
    } catch (error) {
      console.error('Problem fetching new scene: ', error)
    } finally {
      setSceneLoading(false)
    }
  }, [])

  const selectOption = useCallback(async (option: GameOption) => {
    const nextScene = option.nextSceneId
      ? await SceneStore.get(option.nextSceneId)
      : undefined
    if (nextScene) {
      await setScene(nextScene)
      return
    }

    if (!currentGame) {
      console.error('Can not select an option if there is no current game.')
      return
    }

    await fetchScene(currentGame, option)
  }, [currentGame, fetchScene, setScene])


  // Game functions
  const setGame = useCallback(async (gameId: string) => {
    const game = await GameStore.get(gameId)
    if (!game) {
      console.warn('No game found with id: ', gameId)
      _setGame(undefined)
      return
    }

    _setGame(game)

    const scene = game.currentSceneId
      ? await SceneStore.get(game.currentSceneId)
      : undefined

    if (!scene) {
      fetchScene(game)
      return
    }

    await setScene(scene)
  }, [setScene, fetchScene])

  const createGame = useCallback((newGame: Partial<Game>) => {
    newGame.id = crypto.randomUUID()
    newGame.createdAt = new Date().toISOString()
    newGame.updatedAt = new Date().toISOString()

    return GameStore.create(newGame as Game)
      .then((createdGame) => {
        if (!createdGame) return

        setGames(games.concat(createdGame))

        return createdGame
      })
  }, [games, setGames])

  const updateGame = useCallback((gameUpdate: Partial<Game>) => {
    gameUpdate.updatedAt = new Date().toISOString()

    return GameStore.update(gameUpdate)
      .then((updatedGame) => {
        if (!updatedGame) return

        setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g))

        return updatedGame
      })
  }, [games, setGames])

  const removeGame = useCallback((gameId: string) => {
    return GameStore.remove(gameId)
      .then((removed) => {
        if (!removed) return false

        setGames(games.filter(g => g.id !== gameId))

        return true
      })
  }, [games, setGames])

  // Load all games when the page loads
  useEffect(() => {
    GameStore.getAll().then((g) => setGames(g))
  }, [])

  return <appContext.Provider value={{
    layer,
    games,
    sceneLoading,
    currentGame,
    currentScene,
    currentOptions,
    selectOption,
    setGame,
    showMainMenu,
    showNewGame,
    showLoadGame,
    showGameHistory,
    showSceneViewer,
    createGame,
    updateGame,
    removeGame
  }}>
    {children}
  </appContext.Provider>
}