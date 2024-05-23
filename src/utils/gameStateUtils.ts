import { GameState } from "../api/explore"

export const mergeGameStates = (states: GameState[]): GameState => {
  return states.filter(Boolean).reduce((prev, next) => {
    const newState = Object.fromEntries(
      Object.entries(next).map(([k,v]) => {
        const prevValue = prev[k]
        if (prevValue && typeof prevValue === 'number' && typeof v === 'number') {
          return [k, prevValue + v]
        } else {
          return [k,v]
        }
      })
    )
    return {
      ...prev,
      ...newState
    }
  })
}