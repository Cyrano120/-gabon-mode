import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AppProvider from './context/AppProvider'
import Header from './components/Header'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import MobileActionBar from './components/MobileActionBar'
import HomePage from './pages/HomePage'
import CataloguePage from './pages/CataloguePage'
import ReservationPage from './pages/ReservationPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function AnimatedRoutes() {
  const location = useLocation()
  const pageClass = `page-${location.pathname === '/' ? 'home' : location.pathname.slice(1)}`

  return (
    <main className={`app-shell ${pageClass}`}>
      <div className="route-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Header />
        <AnimatedRoutes />
        <Footer />
        <Chatbot />
        <MobileActionBar />
      </AppProvider>
    </BrowserRouter>
  )
}
