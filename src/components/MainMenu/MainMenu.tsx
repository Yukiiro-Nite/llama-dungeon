import classNames from "classnames"
import { useContext } from "react"
import { appContext } from "../../context/AppContext"
import './MainMenu.css'

export interface MainMenuProps {
  show: boolean
}

export const MainMenu = ({ show }: MainMenuProps) => {
  const mainMenuClasses = classNames('MainMenu layer', { show })
  const {showNewGame, showLoadGame} = useContext(appContext)

  return (
    <div
      className={mainMenuClasses}
    >
      <h1>Llama Dungeon</h1>
      <ul>
        <li><button onClick={showNewGame}>New Game</button></li>
        <li><button onClick={showLoadGame}>Load Game</button></li>
      </ul>
    </div>
  )
}