import classNames from "classnames"

export interface GameHistoryProps {
  show: boolean
}

export const GameHistory = ({ show }: GameHistoryProps) => {
  const gameHistoryClasses = classNames('GameHistory layer', { show })

  return (
    <div
      className={gameHistoryClasses}
    >
      <h1>Game History</h1>
    </div>
  )
}