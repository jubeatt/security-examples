import { useState } from 'react'

function App() {
  const [url] = useState('javascript:alert(1)')

  return (
    <div>
      <a href={url}>link</a>
    </div>
  )
}

export default App
