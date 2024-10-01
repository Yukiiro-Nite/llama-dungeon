import classNames from "classnames"
import { useCallback, useContext } from "react"
import { appContext } from "../../context/AppContext"
import { Game } from "../../data/data.types"
import "./LoadGame.css"

export interface LoadGameProps {
  show: boolean
}

export const LoadGame = ({ show }: LoadGameProps) => {
  const loadGameClasses = classNames('LoadGame layer', { show })
  const {
    games,
    setGame,
    showSceneViewer,
    showMainMenu
  } = useContext(appContext)

  const startGame = useCallback((game: Game) => {
    setGame(game.id)
    showSceneViewer()
  }, [setGame, showSceneViewer])

  const noGamesClasses = classNames('NoGames layer', { show: games.length === 0 })
  const gameListClasses = classNames('GameList layer', { show: games.length > 0 })

  return (
    <div
      className={loadGameClasses}
    >
      <h1>Load Game</h1>
      <div className={noGamesClasses}>
        <p>There are no games to load.</p>
      </div>
      <button onClick={showMainMenu}>Return to Main Menu</button>
      <ul className={gameListClasses}>
        {
          games.map(g => {
            return (
              <li key={g.id}>
                <h2>{g.name}</h2>
                <dl>
                  <dt>Created at:</dt>
                  <dd>{new Date(g.createdAt).toLocaleString()}</dd>
                  <dt>Last Played:</dt>
                  <dd>{new Date(g.updatedAt).toLocaleString()}</dd>
                </dl>
                <button onClick={() => startGame(g)}>Resume</button>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}