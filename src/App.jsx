import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateRide from './pages/CreateRide'
import RideDetail from './pages/RideDetail'
import Connect from './pages/Connect'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import RazorpayTest from './pages/RazorpayTest'
import { SmoothScrollIndicator } from './components/ModernGraphics'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-16 md:pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-ride" element={<CreateRide />} />
                <Route path="/ride/:id" element={<RideDetail />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/razorpay-test" element={<RazorpayTest />} />
              </Routes>
            </main>
            <Footer />
            <SmoothScrollIndicator />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App