export function bfs(graph, start) {
  const steps = []
  const visited = new Set()
  const queue = [start]
  
  visited.add(start)
  steps.push({ type: 'visit', node: start, queue: [...queue], visited: new Set(visited) })
  
  while (queue.length > 0) {
    const node = queue.shift()
    steps.push({ type: 'dequeue', node, queue: [...queue], visited: new Set(visited) })
    
    const neighbors = graph[node] || []
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        steps.push({ 
          type: 'visit', 
          node: neighbor, 
          parent: node,
          queue: [...queue], 
          visited: new Set(visited) 
        })
      }
    }
  }
  
  steps.push({ type: 'done', visited: new Set(visited) })
  return steps
}

export function dfs(graph, start) {
  const steps = []
  const visited = new Set()
  
  function dfsRecursive(node) {
    visited.add(node)
    steps.push({ type: 'visit', node, visited: new Set(visited) })
    
    const neighbors = graph[node] || []
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        steps.push({ type: 'explore', from: node, to: neighbor })
        dfsRecursive(neighbor)
      }
    }
    
    steps.push({ type: 'backtrack', node, visited: new Set(visited) })
  }
  
  dfsRecursive(start)
  steps.push({ type: 'done', visited: new Set(visited) })
  return steps
}
