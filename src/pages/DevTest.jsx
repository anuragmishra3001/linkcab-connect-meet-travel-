import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rideAPI, chatAPI, paymentAPI } from '../services/api';

const DevTest = () => {
  const { user, isDevMode } = useAuth();
  const [rides, setRides] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, { test, result, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testAPIs = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Get rides
      addTestResult('Get Rides', 'Testing...');
      const ridesResponse = await rideAPI.getRides();
      setRides(ridesResponse.data.data.rides);
      addTestResult('Get Rides', '✅ Success', `Found ${ridesResponse.data.data.rides.length} rides`);

      // Test 2: Get messages for first ride
      if (ridesResponse.data.data.rides.length > 0) {
        const rideId = ridesResponse.data.data.rides[0]._id;
        addTestResult('Get Messages', 'Testing...');
        const messagesResponse = await chatAPI.getMessages(rideId);
        setMessages(messagesResponse.data.data.messages);
        addTestResult('Get Messages', '✅ Success', `Found ${messagesResponse.data.data.messages.length} messages`);
      }

      // Test 3: Create a test ride
      addTestResult('Create Ride', 'Testing...');
      const newRide = {
        from: { address: 'Test Location 1', coordinates: { lat: 40.7128, lng: -74.0060 } },
        to: { address: 'Test Location 2', coordinates: { lat: 40.7589, lng: -73.9851 } },
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00',
        seats: 3,
        price: 20,
        description: 'Test ride created in development mode'
      };
      const createResponse = await rideAPI.createRide(newRide);
      addTestResult('Create Ride', '✅ Success', `Created ride: ${createResponse.data.data.ride._id}`);

      // Test 4: Payment test
      addTestResult('Payment Test', 'Testing...');
      const paymentResponse = await paymentAPI.createRazorpayOrder({
        amount: 2000,
        currency: 'USD',
        rideId: 'test-ride-123'
      });
      addTestResult('Payment Test', '✅ Success', `Order ID: ${paymentResponse.data.data.orderId}`);

    } catch (error) {
      addTestResult('API Test', '❌ Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDevMode) {
      testAPIs();
    }
  }, [isDevMode]);

  if (!isDevMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Development Mode Test</h1>
            <p className="text-gray-600">This page is only available in development mode.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🚧 Development Mode Test</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Info */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Current User</h2>
              {user ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Rating:</strong> {user.rating}/5</p>
                  <p><strong>Total Rides:</strong> {user.totalRides}</p>
                  <p><strong>Subscribed:</strong> {user.isSubscribed ? 'Yes' : 'No'}</p>
                </div>
              ) : (
                <p className="text-gray-600">No user logged in</p>
              )}
            </div>

            {/* Test Results */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">API Test Results</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <span className="font-mono text-xs text-gray-500">{result.timestamp}</span>
                    <span className="font-medium">{result.test}:</span>
                    <span className={result.result.includes('✅') ? 'text-green-600' : result.result.includes('❌') ? 'text-red-600' : 'text-yellow-600'}>
                      {result.result}
                    </span>
                    {result.details && <span className="text-gray-600">({result.details})</span>}
                  </div>
                ))}
              </div>
              <button
                onClick={testAPIs}
                disabled={loading}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Run Tests Again'}
              </button>
            </div>
          </div>

          {/* Mock Data Display */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rides */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mock Rides ({rides.length})</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {rides.map((ride) => (
                  <div key={ride._id} className="bg-white p-3 rounded border">
                    <p className="font-medium">{ride.from.address} → {ride.to.address}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(ride.date).toLocaleDateString()} at {ride.time} | ${ride.price} | {ride.availableSeats} seats
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mock Messages ({messages.length})</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message._id} className="bg-white p-3 rounded border">
                    <p className="font-medium text-sm">{message.senderName}</p>
                    <p className="text-gray-800">{message.content}</p>
                    <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Development Mode Info */}
          <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">Development Mode Features</h2>
            <ul className="space-y-2 text-yellow-800">
              <li>✅ Mock authentication (auto-login with test user)</li>
              <li>✅ Mock API responses for all endpoints</li>
              <li>✅ Mock socket connections</li>
              <li>✅ Sample data for rides, messages, and users</li>
              <li>✅ Simulated payment processing</li>
              <li>✅ No backend server required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTest;
