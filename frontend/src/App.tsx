import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Emprestimos } from './pages/Emprestimos'
import { Livros } from './pages/Livros'
import { Usuarios } from './pages/Usuario'
import { Navbar } from './components/Navbar'
import { Dashboard } from './components/Dashboard'
function App() {

  return (
    <>
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
        <Navbar />
        
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/livros" element={<Livros />} />
            <Route path="/emprestimos" element={<Emprestimos />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter> 
    </>
  )
}

export default App
