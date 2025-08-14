# Rating and Review System

## Overview

The LinkCab rating and review system allows passengers and hosts to rate and review each other after a ride is completed. This helps build trust within the community and provides valuable feedback for users.

## Features

- **Dual-sided Reviews**: Both passengers and hosts can review each other
- **Star Ratings**: Users can give ratings from 1 to 5 stars
- **Written Reviews**: Optional comments can be added to provide more detailed feedback
- **Average Rating**: User profiles display the average of all ratings received
- **Review History**: Users can view all reviews they've received on their profile

## How It Works

### For Hosts

1. After completing a ride (by clicking the "Complete Ride" button), hosts can rate each passenger
2. Navigate to the "Completed Rides" page from your profile
3. Find the completed ride and click "Rate Passenger" next to each passenger
4. Select a star rating (1-5) and optionally add a comment
5. Submit your review

### For Passengers

1. Once a host marks a ride as completed, passengers can rate the host
2. Navigate to the "Completed Rides" page from your profile
3. Find the completed ride and click "Rate Host"
4. Select a star rating (1-5) and optionally add a comment
5. Submit your review

## Review Guidelines

- Be honest and fair in your ratings
- Focus on the ride experience (punctuality, communication, cleanliness, etc.)
- Avoid personal attacks or inappropriate language
- Reviews cannot be edited after submission, so take your time to provide accurate feedback

## Technical Implementation

### Database Schema

The review system uses a dedicated `Review` model with the following fields:

- `reviewerId`: The user giving the review
- `revieweeId`: The user being reviewed
- `rideId`: The associated ride
- `rating`: Numeric rating (1-5)
- `comment`: Optional text feedback
- `reviewType`: Either 'passenger-to-host' or 'host-to-passenger'
- `createdAt`: Timestamp of when the review was created

### API Endpoints

- `POST /api/review`: Create a new review
- `GET /api/review/user/:userId`: Get reviews for a specific user
- `GET /api/review/ride/:rideId`: Get all reviews for a specific ride

### User Profile Updates

When a user receives a new review, their average rating is automatically recalculated and updated in the database.

## Future Enhancements

- **Response to Reviews**: Allow users to respond to reviews they've received
- **Helpful Votes**: Let users mark reviews as helpful
- **Review Filtering**: Filter reviews by rating or date
- **Review Reports**: Allow users to report inappropriate reviews

## Support

If you have any questions or issues with the rating system, please contact our support team at support@linkcab.com.