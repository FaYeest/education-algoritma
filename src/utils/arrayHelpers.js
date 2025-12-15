export function generateRandomArray(size, min = 1, max = 100) {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

export function generateSortedArray(size, ascending = true) {
  const arr = Array.from({ length: size }, (_, i) => i + 1)
  return ascending ? arr : arr.reverse()
}

export function shuffleArray(arr) {
  const newArr = [...arr]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}
