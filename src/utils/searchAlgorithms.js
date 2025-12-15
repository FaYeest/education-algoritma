export function linearSearch(arr, target) {
  const steps = []
  
  for (let i = 0; i < arr.length; i++) {
    steps.push({ 
      type: 'check', 
      index: i, 
      value: arr[i],
      found: arr[i] === target 
    })
    
    if (arr[i] === target) {
      steps.push({ type: 'found', index: i })
      return steps
    }
  }
  
  steps.push({ type: 'not-found' })
  return steps
}

export function binarySearch(arr, target) {
  const steps = []
  let left = 0
  let right = arr.length - 1
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    
    steps.push({ 
      type: 'check', 
      index: mid, 
      range: [left, right],
      value: arr[mid] 
    })
    
    if (arr[mid] === target) {
      steps.push({ type: 'found', index: mid })
      return steps
    }
    
    if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  
  steps.push({ type: 'not-found' })
  return steps
}
