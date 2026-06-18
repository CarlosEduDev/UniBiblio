import { useState } from 'react'
import './App.css'
import { Usuarios } from './components/Usuario'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Usuarios/>
    </>
  )
}

export default App
