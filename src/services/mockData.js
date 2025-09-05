// Mock data for development mode
export const mockUsers = [
  {
    _id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    age: 28,
    gender: 'male',
    bio: 'I love traveling and meeting new people!',
    isPhoneVerified: true,
    rating: 4.8,
    totalRides: 15,
    isSubscribed: false,
    subscription: null,
    profilePicture: null,
    preferences: {
      smoking: false,
      music: true,
      pets: false
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1234567891',
    age: 25,
    gender: 'female',
    bio: 'Frequent traveler, love road trips!',
    isPhoneVerified: true,
    rating: 4.9,
    totalRides: 23,
    isSubscribed: true,
    subscription: {
      plan: 'gold',
      status: 'active',
      startDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    profilePicture: null,
    preferences: {
      smoking: false,
      music: false,
      pets: true
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1234567892',
    age: 32,
    gender: 'male',
    bio: 'Professional driver, safe and reliable.',
    isPhoneVerified: true,
    rating: 4.7,
    totalRides: 45,
    isSubscribed: true,
    subscription: {
      plan: 'platinum',
      status: 'active',
      startDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    profilePicture: null,
    preferences: {
      smoking: false,
      music: true,
      pets: false
    },
    createdAt: new Date().toISOString()
  }
];

export const mockRides = [
  {
    _id: 'ride-1',
    host: 'user-1',
    hostName: 'John Doe',
    from: {
      address: 'Downtown Mall, New York',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    to: {
      address: 'Central Park, New York',
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: '09:00',
    seats: 3,
    availableSeats: 2,
    price: 15,
    description: 'Comfortable ride to Central Park. Music allowed, no smoking.',
    status: 'active',
    passengers: ['user-2'],
    preferences: {
      smoking: false,
      music: true,
      pets: false
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ride-2',
    host: 'user-2',
    hostName: 'Sarah Wilson',
    from: {
      address: 'Times Square, New York',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    to: {
      address: 'Brooklyn Bridge, New York',
      coordinates: { lat: 40.7061, lng: -73.9969 }
    },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '14:30',
    seats: 4,
    availableSeats: 3,
    price: 12,
    description: 'Scenic route to Brooklyn Bridge. Pet-friendly car!',
    status: 'active',
    passengers: [],
    preferences: {
      smoking: false,
      music: false,
      pets: true
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ride-3',
    host: 'user-3',
    hostName: 'Mike Johnson',
    from: {
      address: 'JFK Airport, New York',
      coordinates: { lat: 40.6413, lng: -73.7781 }
    },
    to: {
      address: 'Manhattan, New York',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    time: '18:00',
    seats: 2,
    availableSeats: 1,
    price: 25,
    description: 'Airport pickup service. Professional driver with clean car.',
    status: 'active',
    passengers: ['user-1'],
    preferences: {
      smoking: false,
      music: true,
      pets: false
    },
    createdAt: new Date().toISOString()
  }
];

export const mockMessages = [
  {
    _id: 'msg-1',
    rideId: 'ride-1',
    sender: 'user-2',
    senderName: 'Sarah Wilson',
    content: 'Hi! I\'m interested in your ride to Central Park. What time should I be ready?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'msg-2',
    rideId: 'ride-1',
    sender: 'user-1',
    senderName: 'John Doe',
    content: 'Hi Sarah! Please be ready by 8:45 AM. I\'ll pick you up from the address you provided.',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'msg-3',
    rideId: 'ride-1',
    sender: 'user-2',
    senderName: 'Sarah Wilson',
    content: 'Perfect! I\'ll be waiting outside. Thanks!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

export const mockReviews = [
  {
    _id: 'review-1',
    reviewer: 'user-2',
    reviewerName: 'Sarah Wilson',
    reviewee: 'user-1',
    revieweeName: 'John Doe',
    rideId: 'ride-1',
    rating: 5,
    comment: 'Great ride! John was punctual and the car was clean. Highly recommended!',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'review-2',
    reviewer: 'user-1',
    reviewerName: 'John Doe',
    reviewee: 'user-2',
    revieweeName: 'Sarah Wilson',
    rideId: 'ride-1',
    rating: 4,
    comment: 'Sarah was a great passenger. Very friendly and on time.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockPayments = [
  {
    _id: 'payment-1',
    userId: 'user-1',
    rideId: 'ride-1',
    amount: 15,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'razorpay',
    razorpayOrderId: 'order_test_123',
    razorpayPaymentId: 'pay_test_123',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper functions for mock data
export const getMockUser = (userId) => {
  return mockUsers.find(user => user._id === userId);
};

export const getMockRide = (rideId) => {
  return mockRides.find(ride => ride._id === rideId);
};

export const getMockMessages = (rideId) => {
  return mockMessages.filter(msg => msg.rideId === rideId);
};

export const getMockReviews = (userId) => {
  return mockReviews.filter(review => review.reviewee === userId);
};

export const getMockRides = (filters = {}) => {
  let filteredRides = [...mockRides];
  
  if (filters.from) {
    filteredRides = filteredRides.filter(ride => 
      ride.from.address.toLowerCase().includes(filters.from.toLowerCase())
    );
  }
  
  if (filters.to) {
    filteredRides = filteredRides.filter(ride => 
      ride.to.address.toLowerCase().includes(filters.to.toLowerCase())
    );
  }
  
  if (filters.date) {
    const filterDate = new Date(filters.date);
    filteredRides = filteredRides.filter(ride => {
      const rideDate = new Date(ride.date);
      return rideDate.toDateString() === filterDate.toDateString();
    });
  }
  
  if (filters.seats) {
    filteredRides = filteredRides.filter(ride => 
      ride.availableSeats >= parseInt(filters.seats)
    );
  }
  
  return filteredRides;
};

export const addMockMessage = (rideId, sender, senderName, content) => {
  const newMessage = {
    _id: `msg-${Date.now()}`,
    rideId,
    sender,
    senderName,
    content,
    timestamp: new Date().toISOString()
  };
  mockMessages.push(newMessage);
  return newMessage;
};

export const addMockRide = (rideData) => {
  const newRide = {
    _id: `ride-${Date.now()}`,
    ...rideData,
    status: 'active',
    passengers: [],
    createdAt: new Date().toISOString()
  };
  mockRides.push(newRide);
  return newRide;
};

export const bookMockRide = (rideId, userId) => {
  const ride = getMockRide(rideId);
  if (ride && ride.availableSeats > 0) {
    ride.passengers.push(userId);
    ride.availableSeats--;
    return { success: true, ride };
  }
  return { success: false, error: 'No seats available' };
};
