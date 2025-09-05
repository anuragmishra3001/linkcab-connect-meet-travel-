// Mock data for development mode - Indian users and places
export const mockUsers = [
  {
    _id: 'user-1',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@gmail.com',
    phone: '+919876543210',
    age: 28,
    gender: 'male',
    bio: 'I love traveling and meeting new people! Safe driver with 5+ years experience.',
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
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    phone: '+919876543211',
    age: 25,
    gender: 'female',
    bio: 'Frequent traveler, love road trips! Always punctual and friendly.',
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
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+919876543212',
    age: 32,
    gender: 'male',
    bio: 'Professional driver, safe and reliable. 10+ years experience.',
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
  },
  {
    _id: 'user-4',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@gmail.com',
    phone: '+919876543213',
    age: 26,
    gender: 'female',
    bio: 'Love exploring new places! Clean car, good music, and great conversation.',
    isPhoneVerified: true,
    rating: 4.6,
    totalRides: 18,
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
    _id: 'user-5',
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    phone: '+919876543214',
    age: 30,
    gender: 'male',
    bio: 'Experienced driver, comfortable car. Always on time!',
    isPhoneVerified: true,
    rating: 4.9,
    totalRides: 32,
    isSubscribed: true,
    subscription: {
      plan: 'silver',
      status: 'active',
      startDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    profilePicture: null,
    preferences: {
      smoking: false,
      music: true,
      pets: true
    },
    createdAt: new Date().toISOString()
  }
];

export const mockRides = [
  {
    _id: 'ride-1',
    host: 'user-1',
    hostName: 'Arjun Sharma',
    from: {
      address: 'Connaught Place, New Delhi',
      coordinates: { lat: 28.6315, lng: 77.2167 }
    },
    to: {
      address: 'India Gate, New Delhi',
      coordinates: { lat: 28.6129, lng: 77.2295 }
    },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: '09:00',
    seats: 3,
    availableSeats: 2,
    price: 150,
    description: 'Comfortable ride to India Gate. Music allowed, no smoking. Clean car with AC.',
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
    hostName: 'Priya Patel',
    from: {
      address: 'Marine Drive, Mumbai',
      coordinates: { lat: 18.9440, lng: 72.8258 }
    },
    to: {
      address: 'Gateway of India, Mumbai',
      coordinates: { lat: 18.9220, lng: 72.8347 }
    },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '14:30',
    seats: 4,
    availableSeats: 3,
    price: 120,
    description: 'Scenic route along Marine Drive to Gateway of India. Pet-friendly car!',
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
    hostName: 'Rajesh Kumar',
    from: {
      address: 'Kempegowda International Airport, Bangalore',
      coordinates: { lat: 13.1986, lng: 77.7066 }
    },
    to: {
      address: 'MG Road, Bangalore',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    time: '18:00',
    seats: 2,
    availableSeats: 1,
    price: 250,
    description: 'Airport pickup service. Professional driver with clean car. 10+ years experience.',
    status: 'active',
    passengers: ['user-1'],
    preferences: {
      smoking: false,
      music: true,
      pets: false
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ride-4',
    host: 'user-4',
    hostName: 'Sneha Gupta',
    from: {
      address: 'Park Street, Kolkata',
      coordinates: { lat: 22.5448, lng: 88.3426 }
    },
    to: {
      address: 'Victoria Memorial, Kolkata',
      coordinates: { lat: 22.5448, lng: 88.3426 }
    },
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:30',
    seats: 3,
    availableSeats: 2,
    price: 100,
    description: 'Heritage tour ride to Victoria Memorial. Great for sightseeing!',
    status: 'active',
    passengers: [],
    preferences: {
      smoking: false,
      music: true,
      pets: false
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ride-5',
    host: 'user-5',
    hostName: 'Vikram Singh',
    from: {
      address: 'Chandigarh Railway Station',
      coordinates: { lat: 30.7333, lng: 76.7794 }
    },
    to: {
      address: 'Sector 17, Chandigarh',
      coordinates: { lat: 30.7333, lng: 76.7794 }
    },
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: '16:00',
    seats: 4,
    availableSeats: 3,
    price: 80,
    description: 'Railway station pickup to Sector 17. Comfortable ride with experienced driver.',
    status: 'active',
    passengers: [],
    preferences: {
      smoking: false,
      music: true,
      pets: true
    },
    createdAt: new Date().toISOString()
  }
];

export const mockMessages = [
  {
    _id: 'msg-1',
    rideId: 'ride-1',
    sender: 'user-2',
    senderName: 'Priya Patel',
    content: 'Hi Arjun! I\'m interested in your ride to India Gate. What time should I be ready?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'msg-2',
    rideId: 'ride-1',
    sender: 'user-1',
    senderName: 'Arjun Sharma',
    content: 'Hi Priya! Please be ready by 8:45 AM. I\'ll pick you up from Connaught Place metro station.',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'msg-3',
    rideId: 'ride-1',
    sender: 'user-2',
    senderName: 'Priya Patel',
    content: 'Perfect! I\'ll be waiting outside the metro station. Thanks!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'msg-4',
    rideId: 'ride-2',
    sender: 'user-4',
    senderName: 'Sneha Gupta',
    content: 'Hi Priya! Is your car pet-friendly? I have a small dog.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'msg-5',
    rideId: 'ride-2',
    sender: 'user-2',
    senderName: 'Priya Patel',
    content: 'Yes Sneha! My car is pet-friendly. Your dog is welcome!',
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
  }
];

export const mockReviews = [
  {
    _id: 'review-1',
    reviewer: 'user-2',
    reviewerName: 'Priya Patel',
    reviewee: 'user-1',
    revieweeName: 'Arjun Sharma',
    rideId: 'ride-1',
    rating: 5,
    comment: 'Excellent ride! Arjun was punctual and the car was very clean. Great conversation too. Highly recommended!',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'review-2',
    reviewer: 'user-1',
    reviewerName: 'Arjun Sharma',
    reviewee: 'user-2',
    revieweeName: 'Priya Patel',
    rideId: 'ride-1',
    rating: 4,
    comment: 'Priya was a great passenger. Very friendly and on time. Would love to give her a ride again!',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'review-3',
    reviewer: 'user-4',
    reviewerName: 'Sneha Gupta',
    reviewee: 'user-3',
    revieweeName: 'Rajesh Kumar',
    rideId: 'ride-3',
    rating: 5,
    comment: 'Professional driver with excellent service. Car was spotless and Rajesh was very helpful with luggage.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'review-4',
    reviewer: 'user-5',
    reviewerName: 'Vikram Singh',
    reviewee: 'user-2',
    revieweeName: 'Priya Patel',
    rideId: 'ride-2',
    rating: 4,
    comment: 'Great ride along Marine Drive! Priya was very accommodating with my pet. Clean car and safe driving.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockPayments = [
  {
    _id: 'payment-1',
    userId: 'user-1',
    rideId: 'ride-1',
    amount: 150,
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'razorpay',
    razorpayOrderId: 'order_test_123',
    razorpayPaymentId: 'pay_test_123',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'payment-2',
    userId: 'user-2',
    rideId: 'ride-2',
    amount: 120,
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'razorpay',
    razorpayOrderId: 'order_test_456',
    razorpayPaymentId: 'pay_test_456',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'payment-3',
    userId: 'user-3',
    rideId: 'ride-3',
    amount: 250,
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'razorpay',
    razorpayOrderId: 'order_test_789',
    razorpayPaymentId: 'pay_test_789',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
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
