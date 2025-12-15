import { createContext, useContext, useState } from 'react'

const SpeedContext = createContext()

export function SpeedProvider({ children }) {
  const [speed, setSpeed] = useState(2) // Default lebih lambat (dari 5 ke 2)

  const getDelay = () => {
    // Mapping: speed 1 = 2000ms, speed 5 = 400ms, speed 10 = 200ms
    const maxDelay = 2000
    const minDelay = 200
    return maxDelay - ((speed - 1) * (maxDelay - minDelay) / 9)
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
