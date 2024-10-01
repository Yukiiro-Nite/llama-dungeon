import { GameScene } from "./data.types"
import { generateStore } from "./createStore"

const store = generateStore<GameScene>('gameScene')

export const create = store.create
export const get = store.get
export const update = store.update
export const remove = store.remove
