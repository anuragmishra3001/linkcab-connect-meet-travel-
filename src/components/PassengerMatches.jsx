import { useState, useEffect } from 'react';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PassengerMatches = ({ rideId, onSelectPassenger }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useAI, setUseAI] = useState(false);
  const { user } = useAuth();

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await matchAPI.getMatches(rideId, useAI);
      setMatches(response.data.data.matches);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch passenger matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rideId) {
      fetchMatches();
    }
  }, [rideId, useAI]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return <div className="flex">{stars}</div>;
  };

  const renderPreferenceMatch = (preference, value) => {
    const isMatch = matches[0]?.user?.preferences?.[preference] === value;
    return (
      <div className={`text-sm ${isMatch ? 'text-green-600' : 'text-red-600'}`}>
        {preference}: {value ? 'Yes' : 'No'} {isMatch ? '✓' : '✗'}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Suggested Passengers</h2>
        <div className="flex items-center">
          <label className="mr-2 text-sm text-gray-600">Use AI Matching</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              name="useAI"
              id="useAI"
              checked={useAI}
              onChange={() => setUseAI(!useAI)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="useAI"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${useAI ? 'bg-blue-500' : 'bg-gray-300'}`}
            ></label>
          </div>
          <button
            onClick={fetchMatches}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {matches.length === 0 && !loading && !error ? (
        <div className="text-gray-500 text-center py-4">No passenger matches found</div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.user._id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <img
                    src={match.user.profilePicture || 'https://via.placeholder.com/50'}
                    alt={match.user.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{match.user.name}</h3>
                    <div className="flex items-center">
                      {renderStars(match.user.rating)}
                      <span className="ml-1 text-sm text-gray-600">
                        ({match.user.rating.toFixed(1)})
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{match.user.totalRides} rides</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {useAI ? (
                      <div>
                        <div className="text-sm text-gray-600">Match Score</div>
                        <div className="text-2xl font-bold text-blue-600">{match.finalScore}%</div>
                        <div className="flex space-x-2 text-xs text-gray-500">
                          <span>Rule: {match.ruleScore}%</span>
                          <span>AI: {match.aiScore}%</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-gray-600">Match Score</div>
                        <div className="text-2xl font-bold text-blue-600">{match.score}%</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {renderPreferenceMatch('smoking', match.user.preferences?.smoking)}
                {renderPreferenceMatch('music', match.user.preferences?.music)}
                {renderPreferenceMatch('pets', match.user.preferences?.pets)}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onSelectPassenger(match.user)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Invite to Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3b82f6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #d1d5db;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
};

export default PassengerMatches;