import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Connect from './pages/Connect'
import Messages from './pages/Messages'
import Payment from './pages/Payment'
import CreateRide from './pages/CreateRide'
import RideDetail from './pages/RideDetail'
import Profile from './pages/Profile'
import CompletedRides from './pages/CompletedRides'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <main className="pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/create-ride" element={<CreateRide />} />
            <Route path="/ride/:id" element={<RideDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/completed-rides" element={<CompletedRides />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App