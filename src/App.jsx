import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Dashboard from './pages/dashboard'
import Rover3DView from './pages/rover'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rover" element={<Rover3DView />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}