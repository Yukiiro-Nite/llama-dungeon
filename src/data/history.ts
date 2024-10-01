import { ChatMessage } from "../api/explore";
import { Game, GameOption, GameScene } from "./data.types";
import * as SceneStore from "../data/GameScene"
import * as OptionStore from "../data/GameOption"

export interface HistoryNode {
  scene: GameScene,
  option?: GameOption
}

export const getMessageHistory = async (game: Game, option?: GameOption): Promise<ChatMessage[]> => {
  return getHistory(game, option)
    .then(history => Promise.all(history.map(async ({scene, option}) => {
      const sceneContent = await sceneToContent(scene)
      const messages = [{ role: 'assistant', content: sceneContent }] as ChatMessage[]
      if (option) {
        messages.unshift({ role: 'user', content: option.description })
      }

      return messages
    })))
    .then(messages => messages.flatMap(m => m))
}

export const getHistory = async (game: Game, option?: GameOption): Promise<HistoryNode[]> => {
  const history = [] as HistoryNode[]

  if (!game.currentSceneId) {
    return history
  }

  let scene = await SceneStore.get(option?.sceneId ?? game.currentSceneId)
  if (!scene) return history

  history.push({ scene, option })

  while (scene.prevSceneId) {
    const currentSceneId = scene.id
    const options = await OptionStore.getSceneOptions(scene.prevSceneId)
    const option = options.find(o => o.nextSceneId === currentSceneId)
    scene = await SceneStore.get(scene.prevSceneId)
    if (!scene) return history

    history.push({ scene, option })
  }

  return history
}

export const sceneToContent = async (scene: GameScene): Promise<string> => {
  const options = await OptionStore.getSceneOptions(scene.id)
  return `${scene.description}
  
  ${options.map((o, i) => `${i+1}. ${o.description}`).join('\n')}`
}