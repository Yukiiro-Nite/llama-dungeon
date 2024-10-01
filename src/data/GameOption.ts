import { GameOption } from "./data.types"
import { generateStore } from "./createStore"

const store = generateStore<GameOption>('gameOption')

export const create = store.create
export const get = store.get
export const update = store.update
export const remove = store.remove

export const getSceneOptions = async (sceneId: string): Promise<GameOption[]> => {
  const options = [] as GameOption[]

  try {
    await store.store.iterate<GameOption, void>((option) => {
      if (option.sceneId === sceneId) {
        options.push(option)
      }
    })
  } catch (error) {
    console.error('Problem getting scene options: ', error)
  }

  return options
}