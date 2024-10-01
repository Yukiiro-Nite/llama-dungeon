import { useContext } from 'react'
import './App.css'
import { MainMenu } from './components/MainMenu/MainMenu'
import { NewGame } from './components/NewGame/NewGame'
import { LoadGame } from './components/LoadGame/LoadGame'
import { GameHistory } from './components/GameHistory/GameHistory'
import { SceneViewer } from './components/SceneViewer/SceneViewer'
import { appContext } from './context/AppContext'

export const App = () => {
  const { layer } = useContext(appContext)

  return (
    <main className='App'>
      <MainMenu show={ layer === 'MainMenu' } />
      <NewGame show={ layer === 'NewGame' } />
      <LoadGame show={ layer === 'LoadGame' } />
      <GameHistory show={ layer === 'GameHistory' } />
      <SceneViewer show={ layer === 'SceneViewer' } />
    </main>
  )
}
