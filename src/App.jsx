import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import AlgorithmDetail from './pages/AlgorithmDetail'
import { ThemeProvider } from './context/ThemeContext'
import { SpeedProvider } from './context/SpeedContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <SpeedProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/algorithm/:id" element={<AlgorithmDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SpeedProvider>
    </ThemeProvider>
  )
}

export default App
