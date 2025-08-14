import { Link, useLocation } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

const PaymentCancel = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const rideId = params.get('ride_id')
  
  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <Card className="p-8 text-center">
        <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled and you have not been charged. 
          You can try booking the ride again whenever you're ready.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {rideId ? (
            <Link to={`/ride/${rideId}`} className="flex-1">
              <Button className="w-full">
                Return to Ride
              </Button>
            </Link>
          ) : (
            <Link to="/" className="flex-1">
              <Button className="w-full">
                Find Rides
              </Button>
            </Link>
          )}
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default PaymentCancel