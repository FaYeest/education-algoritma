export function bubbleSort(arr) {
  const steps = []
  const array = [...arr]
  
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      steps.push({ type: 'compare', indices: [j, j + 1], array: [...array] })
      
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]]
        steps.push({ type: 'swap', indices: [j, j + 1], array: [...array] })
      }
    }
  }
  
  steps.push({ type: 'done', array: [...array] })
  return steps
}

export function selectionSort(arr) {
  const steps = []
  const array = [...arr]
  
  for (let i = 0; i < array.length; i++) {
    let minIdx = i
    
    for (let j = i + 1; j < array.length; j++) {
      steps.push({ type: 'compare', indices: [minIdx, j], array: [...array] })
      
      if (array[j] < array[minIdx]) {
        minIdx = j
      }
    }
    
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]]
      steps.push({ type: 'swap', indices: [i, minIdx], array: [...array] })
    }
  }
  
  steps.push({ type: 'done', array: [...array] })
  return steps
}

export function insertionSort(arr) {
  const steps = []
  const array = [...arr]
  
  for (let i = 1; i < array.length; i++) {
    let key = array[i]
    let j = i - 1
    
    steps.push({ type: 'select', indices: [i], array: [...array] })
    
    while (j >= 0 && array[j] > key) {
      steps.push({ type: 'compare', indices: [j, j + 1], array: [...array] })
      array[j + 1] = array[j]
      j--
      steps.push({ type: 'shift', indices: [j + 1], array: [...array] })
    }
    
    array[j + 1] = key
    steps.push({ type: 'insert', indices: [j + 1], array: [...array] })
  }
  
  steps.push({ type: 'done', array: [...array] })
  return steps
}
