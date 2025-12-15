import { useState, useCallback } from 'react'

export function useAlgorithmState(initialData) {
  const [data, setData] = useState(initialData)
  const [steps, setSteps] = useState([])

  const randomize = useCallback((size = data.length) => {
    const newData = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 100) + 1
    )
    setData(newData)
    setSteps([])
    return newData
  }, [data.length])

  const reset = useCallback(() => {
    setData(initialData)
    setSteps([])
  }, [initialData])

  return { data, setData, steps, setSteps, randomize, reset }
}
