import { createContext, useContext, useState } from 'react'

const SpeedContext = createContext()

export function SpeedProvider({ children }) {
  const [speed, setSpeed] = useState(5)

  const getDelay = () => {
    return 1000 / speed
  }

  return (
    <SpeedContext.Provider value={{ speed, setSpeed, getDelay }}>
      {children}
    </SpeedContext.Provider>
  )
}

export function useSpeed() {
  const context = useContext(SpeedContext)
  if (!context) {
    throw new Error('useSpeed must be used within SpeedProvider')
  }
  return context
}
