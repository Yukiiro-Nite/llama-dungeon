import classNames from 'classnames'
import { useContext } from 'react'
import { GameResponse, ResponseError } from '../../api/explore'
import { appContext } from '../../context/AppContext'
import './SceneViewer.css'

export interface ExploreRequest {
  loading: boolean,
  data?: GameResponse,
  error?: ResponseError
}

export interface SceneViewerProps {
  show: boolean
}

export const SceneViewer = ({ show }: SceneViewerProps) => {
  const sceneViewerClasses = classNames('SceneViewer layer', { show })
  const {
    sceneLoading,
    currentScene,
    currentOptions,
    selectOption
  } = useContext(appContext)

  const loadingClasses = classNames('LoadingIndicator layer', { show: sceneLoading })
  const sceneClasses = classNames('Scene layer', { show: !sceneLoading })
  const optionsClasses = classNames('Options layer', { show: !sceneLoading })

  return (
    <div className={sceneViewerClasses}>
      <p className={loadingClasses}>Loading Scene</p>
      <p className={sceneClasses}>{currentScene?.description}</p>
      <ul className={optionsClasses}>
        {
          currentOptions?.map(o => {
            const optionClasses = classNames('Option', { hasBeenSelected: o.hasBeenPicked })
            return (
              <li key={o.id} className={optionClasses}>
                <button onClick={() => selectOption(o)}>{o.description}</button>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
