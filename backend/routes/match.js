import express from 'express';
import { check, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { protect as auth } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

/**
 * Helper function to calculate rule-based match scores
 */
const calculateRuleBasedScore = (passenger, ride) => {
  let score = 0;
  
  // Base score starts at 50 (out of 100)
  score += 50;
  
  // Rating bonus (up to 20 points)
  score += Math.min(passenger.rating * 4, 20);
  
  // Experience bonus (up to 10 points)
  score += Math.min(passenger.totalRides * 0.5, 10);
  
  // Preference matching (up to 20 points)
  const userPrefs = passenger.preferences || {};
  const ridePrefs = ride.preferences || {};
  
  // +5 points for each matching preference
  if (userPrefs.smoking === ridePrefs.smoking) score += 5;
  if (userPrefs.music === ridePrefs.music) score += 5;
  if (userPrefs.pets === ridePrefs.pets) score += 5;
  
  // Verification bonus (up to 5 points)
  if (passenger.isEmailVerified) score += 5;
  
  return Math.min(score, 100); // Cap at 100
};

/**
 * Helper function to generate embeddings using OpenAI API
 */
async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-ada-002'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Helper function to calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * @route   POST /api/match
 * @desc    Find top 5 passenger matches for a ride based on preferences and profiles
 * @access  Private (host only)
 */
router.post('/', auth, [
  check('rideId', 'Valid ride ID is required').isMongoId(),
  check('useAI', 'useAI must be a boolean').optional().isBoolean()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { rideId, useAI = false } = req.body;
    
    // Find the ride
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Check if user is the host of the ride
    if (ride.hostId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the host can request matches for this ride' });
    }
    
    // Get all users who are not the host and not already passengers
    const existingPassengerIds = ride.passengers.map(p => p.user.toString());
    
    // Base query to find potential passengers
    const baseQuery = {
      _id: { $ne: req.user.id, $nin: existingPassengerIds },
      isPhoneVerified: true // Only consider verified users
    };
    
    // Apply gender preference if specified
    if (ride.preferences.genderPreference !== 'any') {
      baseQuery.gender = ride.preferences.genderPreference;
    }
    
    // Find potential passengers
    const potentialPassengers = await User.find(baseQuery).select('-password');
    
    // Calculate rule-based match scores
    let scoredPassengers = potentialPassengers.map(passenger => {
      const score = calculateRuleBasedScore(passenger, ride);
      
      return {
        user: passenger,
        score,
        aiScore: 0,
        finalScore: score
      };
    });
    
    // If AI matching is requested and OpenAI API key is available
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        // Create a text representation of the ride
        const rideText = `Ride from ${ride.startLocation.address} to ${ride.endLocation.address} on ${new Date(ride.dateTime).toLocaleString()}. ` +
          `Preferences: ${ride.preferences.genderPreference} passengers, ` +
          `${ride.preferences.smoking ? 'smoking allowed' : 'no smoking'}, ` +
          `${ride.preferences.pets ? 'pets allowed' : 'no pets'}, ` +
          `${ride.preferences.music ? 'music allowed' : 'no music'}. ` +
          `${ride.description || ''}`;
        
        // Generate embedding for the ride
        const rideEmbedding = await generateEmbedding(rideText);
        
        // Generate embeddings for each passenger and calculate similarity
        const aiScorePromises = scoredPassengers.map(async (scoredPassenger) => {
          const passenger = scoredPassenger.user;
          
          // Create a text representation of the passenger
          const passengerText = `User profile: ${passenger.name}, ${passenger.age} years old, ${passenger.gender}. ` +
            `Bio: ${passenger.bio || 'No bio provided'}. ` +
            `Preferences: ${passenger.preferences.smoking ? 'smoking' : 'no smoking'}, ` +
            `${passenger.preferences.pets ? 'pets' : 'no pets'}, ` +
            `${passenger.preferences.music ? 'music' : 'no music'}.`;
          
          // Generate embedding for the passenger
          const passengerEmbedding = await generateEmbedding(passengerText);
          
          // Calculate similarity score (0-1) and convert to 0-100 scale
          const similarity = cosineSimilarity(rideEmbedding, passengerEmbedding);
          const aiScore = Math.round(similarity * 100);
          
          return {
            ...scoredPassenger,
            aiScore,
            // Weighted combination: 60% rule-based, 40% AI
            finalScore: Math.round(scoredPassenger.score * 0.6 + aiScore * 0.4)
          };
        });
        
        // Wait for all AI scores to be calculated
        scoredPassengers = await Promise.all(aiScorePromises);
        
        // Return top 5 matches based on final score
        return res.json({
          success: true,
          message: 'Matches found using combined rule-based and AI ranking',
          data: {
            matches: scoredPassengers
              .sort((a, b) => b.finalScore - a.finalScore)
              .slice(0, 5)
              .map(match => ({
                user: match.user,
                ruleScore: match.score,
                aiScore: match.aiScore,
                finalScore: match.finalScore
              }))
          }
        });
      } catch (aiError) {
        console.error('Error with AI matching:', aiError);
        // Fall back to rule-based matching
      }
    }
    
    // Return top 5 matches based on rule-based scoring only
    res.json({
      success: true,
      message: 'Matches found using rule-based ranking',
      data: {
        matches: scoredPassengers
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(match => ({
            user: match.user,
            score: match.score
          }))
      }
    });
  } catch (error) {
    console.error('Error finding matches:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;