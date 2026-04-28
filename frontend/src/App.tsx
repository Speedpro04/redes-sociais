import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StoresPage from './pages/StoresPage'
import VehiclesPage from './pages/VehiclesPage'
import SocialMediaPage from './pages/SocialMediaPage'
import VideosPage from './pages/VideosPage'
import SchedulerPage from './pages/SchedulerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/social-media" element={<SocialMediaPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/scheduler" element={<SchedulerPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
