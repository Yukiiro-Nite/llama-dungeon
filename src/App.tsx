import { useCallback, useState } from 'react'
import './App.css'
import { ChatMessage, GameOption, GameResponse, GameState, ResponseError, explore } from './api/explore'
import { DEFAULT_PROMPT } from './utils/prompts'
import { mergeGameStates } from './utils/gameStateUtils'
import classNames from 'classnames'

export interface ExploreRequest {
  loading: boolean,
  data?: GameResponse,
  error?: ResponseError
}

function App() {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [gameState, setGameState] = useState<GameState>({})
  const [exploreRequest, setExploreRequest] = useState<ExploreRequest>({ loading: false })

  const handleStart = useCallback(() => {
    setExploreRequest({ loading: true })
    explore(DEFAULT_PROMPT, history, gameState)
      .then((gameResponse) => {
        console.log('Got response after starting: ', gameResponse)
        const newItem = { role: 'assistant', content: JSON.stringify(gameResponse) } as ChatMessage
        setExploreRequest({ loading: false, data: gameResponse })
        setHistory([newItem].concat(history))
      })
      .catch((error) => {
        console.error('Got error after starting: ', error)
        setExploreRequest({ loading: false, data: exploreRequest.data, error })
      })
  }, [exploreRequest.data, gameState, history])

  const handleOption = useCallback((option: GameOption) => {
    const newItem = { role: 'user', content: JSON.stringify(option) } as ChatMessage
    const newHistory = [newItem].concat(history)
    const newGameState = mergeGameStates([gameState, option.gameState])

    explore(DEFAULT_PROMPT, newHistory, newGameState)
      .then((gameResponse) => {
        console.log('Got response after picking option: ', gameResponse)
        const newItem = { role: 'assistant', content: JSON.stringify(gameResponse) } as ChatMessage
        setExploreRequest({ loading: false, data: gameResponse })
        setHistory([newItem].concat(newHistory))
        setGameState(newGameState)
      })
      .catch((error) => {
        console.error('Got error after picking option: ', error)
        setExploreRequest({ loading: false, data: exploreRequest.data, error })
      })
  }, [exploreRequest.data, gameState, history])

  const startButtonClasses = classNames('StartButton', { show: !exploreRequest.data })
  const loadingIndicatorClasses = classNames('LoadingIndicator', { show: exploreRequest.loading })
  const gameViewClasses = classNames('GameView', {show: Boolean(exploreRequest.data)})

  return (
    <main className='App'>
      <button
        className={startButtonClasses}
        onClick={handleStart}
        disabled={Boolean(exploreRequest.data)}
      >
        Start Dungeon
      </button>
      <p className={loadingIndicatorClasses}>Loading...</p>
      <div className={gameViewClasses}>
        <p className='Scene'>{exploreRequest.data?.scene}</p>
        {
          exploreRequest.data?.options?.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOption(option)}
            >
              {option.description}
            </button>
          ))
        }
      </div>
    </main>
  )
}

export default App
