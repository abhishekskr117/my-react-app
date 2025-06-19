import { useState } from 'react'
import './App.css'
import Button from '@mui/material/Button';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React App banayenge</h1>
      <div className="card">
        <Button variant="contained" onClick={() => setCount((count) => count + 1)}>{count} Lat khayega</Button>
      </div>
    </>
  )
}

export default App
