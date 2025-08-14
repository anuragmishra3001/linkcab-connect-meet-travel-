# LinkCab Passenger Matching System

## Overview

The LinkCab Passenger Matching System is designed to help ride hosts find the most compatible passengers for their rides. The system uses a combination of rule-based scoring and optional AI-powered matching to provide the best possible matches.

## Features

- **Rule-based Matching**: Scores potential passengers based on ratings, experience, and preference compatibility
- **AI-powered Matching**: Optional enhancement using OpenAI embeddings to find deeper compatibility patterns
- **Top 5 Suggestions**: Returns the highest-scoring potential passengers
- **Gender Preference Filtering**: Respects the host's gender preferences for passengers
- **Verified Users Only**: Only considers phone-verified users for matching

## How It Works

### Rule-based Matching

The rule-based matching algorithm assigns scores to potential passengers based on the following criteria:

1. **Base Score**: Every potential passenger starts with a base score of 50 points (out of 100)
2. **Rating Bonus**: Up to 20 points based on the passenger's rating (4 points per star)
3. **Experience Bonus**: Up to 10 points based on the passenger's total rides (0.5 points per ride)
4. **Preference Matching**: Up to 15 points for matching preferences
   - +5 points for matching smoking preference
   - +5 points for matching music preference
   - +5 points for matching pets preference
5. **Verification Bonus**: +5 points if the passenger has a verified email

The final score is capped at 100 points.

### AI-powered Matching (Optional)

When AI matching is enabled, the system:

1. Creates text representations of both the ride and potential passengers
2. Generates embeddings using OpenAI's text-embedding-ada-002 model
3. Calculates cosine similarity between the ride and passenger embeddings
4. Combines the AI similarity score (0-100) with the rule-based score using a weighted formula:
   - Final Score = (Rule-based Score × 0.6) + (AI Score × 0.4)

## API Usage

### Backend Endpoint

```
POST /api/match
```

**Request Body:**
```json
{
  "rideId": "65f1a2b3c4d5e6f7a8b9c0d1",  // MongoDB ObjectId of the ride
  "useAI": true                       // Optional, defaults to false
}
```

**Response (Rule-based only):**
```json
{
  "success": true,
  "message": "Matches found using rule-based ranking",
  "data": {
    "matches": [
      {
        "user": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
          "name": "John Doe",
          "rating": 4.5,
          // other user fields...
        },
        "score": 85
      },
      // more matches...
    ]
  }
}
```

**Response (With AI matching):**
```json
{
  "success": true,
  "message": "Matches found using combined rule-based and AI ranking",
  "data": {
    "matches": [
      {
        "user": {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
          "name": "John Doe",
          "rating": 4.5,
          // other user fields...
        },
        "ruleScore": 85,
        "aiScore": 78,
        "finalScore": 82
      },
      // more matches...
    ]
  }
}
```

### Frontend API Service

```javascript
// Using the matchAPI service
import { matchAPI } from '../services/api';

// Get matches with rule-based ranking only
const getBasicMatches = async (rideId) => {
  try {
    const response = await matchAPI.getMatches(rideId);
    return response.data;
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

// Get matches with AI-enhanced ranking
const getAIMatches = async (rideId) => {
  try {
    const response = await matchAPI.getMatches(rideId, true);
    return response.data;
  } catch (error) {
    console.error('Error getting AI matches:', error);
    throw error;
  }
};
```

## Implementation Notes

### OpenAI API Key

To use the AI-powered matching, you need to set the `OPENAI_API_KEY` environment variable in your `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

If the API key is not set, the system will automatically fall back to rule-based matching only.

### Performance Considerations

- AI matching requires multiple API calls to OpenAI, which can increase response time
- Consider implementing caching for embeddings to improve performance
- For large user bases, implement pagination or limit the initial pool of potential passengers

## Future Enhancements

1. **Location-based Matching**: Consider proximity between passenger location and ride route
2. **Time-based Matching**: Consider passenger availability and ride schedule compatibility
3. **Behavioral Matching**: Use past ride data to identify compatible passenger-host pairs
4. **Feedback Loop**: Incorporate match success data to improve the algorithm over time
5. **Batch Processing**: Pre-compute matches for popular routes to improve response time