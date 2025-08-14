import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import FlashCard from './FlashCard'

const RideSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    startLocation: '',
    endLocation: '',
    date: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Only include non-empty values in the search
    const filters = Object.entries(searchParams)
      .filter(([_, value]) => value.trim() !== '')
      .reduce((obj, [key, value]) => {
        // Convert date to dateTime format if present
        if (key === 'date' && value) {
          obj['dateTime'] = value // Backend will handle the date comparison
        } else {
          obj[key] = value
        }
        return obj
      }, {})
    
    onSearch(filters)
  }

  const handleClear = () => {
    setSearchParams({
      startLocation: '',
      endLocation: '',
      date: ''
    })
    // Pass empty object to reset search state
    onSearch({})
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <FlashCard className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Ride
          </h2>
          <p className="text-gray-600 text-lg">
            Search for available rides or create your own journey
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label htmlFor="startLocation" className="block text-sm font-semibold text-gray-700">
                From
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📍</span>
                </div>
                <input
                  type="text"
                  id="startLocation"
                  name="startLocation"
                  value={searchParams.startLocation}
                  onChange={handleChange}
                  placeholder="Enter departure location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="endLocation" className="block text-sm font-semibold text-gray-700">
                To
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🎯</span>
                </div>
                <input
                  type="text"
                  id="endLocation"
                  name="endLocation"
                  value={searchParams.endLocation}
                  onChange={handleChange}
                  placeholder="Enter destination"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📅</span>
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={searchParams.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              size="lg"
              className="flex-1 text-lg py-4"
              icon="🔍"
            >
              Search Rides
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              size="lg"
              className="flex-1 text-lg py-4"
              onClick={handleClear}
              icon="🔄"
            >
              Clear Filters
            </Button>
          </div>
        </form>
      </FlashCard>
    </motion.div>
  )
}

export default RideSearch