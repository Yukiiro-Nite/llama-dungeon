import classNames from "classnames"
import { FormEvent, useCallback, useContext } from "react"
import { appContext } from "../../context/AppContext"
import { defaultStylePrompt, defaultSystemPrompt } from "../../utils/prompts"
import "./NewGame.css"

export interface NewGameProps {
  show: boolean
}

export interface NewGameFormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
  stylePrompt: HTMLTextAreaElement
  systemPrompt: HTMLTextAreaElement
}

export const NewGame = ({ show }: NewGameProps) => {
  const newGameClasses = classNames('NewGame layer', { show })
  const {
    createGame,
    setGame,
    showSceneViewer
  } = useContext(appContext)

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()
    const target = event.target as HTMLFormElement
    const elements = target.elements as NewGameFormElements
    const name = elements.name.value
    const stylePrompt = elements.stylePrompt.value
    const systemPrompt = elements.systemPrompt.value

    const game = {
      name,
      gameState: {},
      stylePrompt,
      systemPrompt
    }
    createGame(game)
      .then(createdGame => {
        if (!createdGame) {
          return
        }

        setGame(createdGame.id)
        showSceneViewer()
      })
  }, [createGame, setGame, showSceneViewer])

  return (
    <div
      className={newGameClasses}
    >
      <h1>New Game</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Game Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Style Prompt</span>
          <p>This part of the prompt controls the style of dungeon that the AI generates. This part is more flexible to change, but could still break the UI in some situations.</p>
          <textarea
            name="stylePrompt"
            required
            defaultValue={defaultStylePrompt}
            rows={15}
          />
        </label>
        <label>
          <span>System Prompt</span>
          <p>This part of the prompt controls the inner workings of the AI's response. I don't recommend changing this, it could break the UI.</p>
          <textarea
            name="systemPrompt"
            required
            defaultValue={defaultSystemPrompt}
            rows={15}
          />
        </label>
        <button>Create Game</button>
      </form>
    </div>
  )
}