import { useState, useEffect } from 'react'
import { reviewAPI } from '../services/api'
import Card from './Card'

const ReviewList = ({ userId, rideId, limit = 5 }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let response
        
        if (userId) {
          response = await reviewAPI.getUserReviews(userId, page, limit)
        } else if (rideId) {
          response = await reviewAPI.getRideReviews(rideId)
        } else {
          throw new Error('Either userId or rideId must be provided')
        }
        
        setReviews(response.data.data.reviews)
        
        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError(err.response?.data?.message || 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    
    fetchReviews()
  }, [userId, rideId, page, limit])

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && reviews.length === 0) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No reviews yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id} className="p-4">
          <div className="flex items-start space-x-4">
            <img
              src={review.reviewerId.avatar || 'https://via.placeholder.com/40'}
              alt={review.reviewerId.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{review.reviewerId.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                {review.reviewType && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {review.reviewType === 'passenger-to-host' ? 'As Passenger' : 'As Host'}
                  </span>
                )}
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
              {review.rideId && (
                <div className="mt-2 text-xs text-gray-500">
                  Ride: {review.rideId.startLocation?.address} to {review.rideId.endLocation?.address}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Previous
          </button>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded">
            {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className={`px-3 py-1 rounded ${page === pagination.pages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewList