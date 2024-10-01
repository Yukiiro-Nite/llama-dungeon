import { Game } from "./data.types"
import { generateStore } from "./createStore"

const store = generateStore<Game>('game')

export const create = store.create
export const get = store.get
export const update = store.update
export const remove = store.remove

export const getAll = async () => {
  const games = [] as Game[]

  try {
    await store.store.iterate<Game, void>((game) => { games.push(game) })
  } catch (error) {
    console.error('Unable to get all games')
  }

  return games
}