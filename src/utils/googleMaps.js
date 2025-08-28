// Google Maps API utility functions

// Initialize Google Maps API
export const initGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
    }
  });
};

// Create Places Autocomplete
export const createAutocomplete = (inputElement, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const maps = await initGoogleMaps();
      
      const defaultOptions = {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'in' }, // Restrict to India
        fields: ['place_id', 'geometry', 'formatted_address', 'name'],
        ...options
      };

      const autocomplete = new maps.places.Autocomplete(inputElement, defaultOptions);
      resolve(autocomplete);
    } catch (error) {
      reject(error);
    }
  });
};

// Get place details from place_id
export const getPlaceDetails = async (placeId) => {
  try {
    const maps = await initGoogleMaps();
    
    return new Promise((resolve, reject) => {
      const service = new maps.places.PlacesService(document.createElement('div'));
      
      service.getDetails(
        {
          placeId: placeId,
          fields: ['geometry', 'formatted_address', 'name', 'place_id']
        },
        (place, status) => {
          if (status === maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(new Error(`Place details failed: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// Create a map instance
export const createMap = async (containerElement, options = {}) => {
  try {
    const maps = await initGoogleMaps();
    
    const defaultOptions = {
      zoom: 13,
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      mapTypeId: maps.MapTypeId.ROADMAP,
      ...options
    };

    const map = new maps.Map(containerElement, defaultOptions);
    return map;
  } catch (error) {
    throw error;
  }
};

// Add a marker to the map
export const addMarker = async (map, position, options = {}) => {
  try {
    const maps = await initGoogleMaps();
    
    const defaultOptions = {
      position: position,
      map: map,
      draggable: true,
      ...options
    };

    const marker = new maps.Marker(defaultOptions);
    return marker;
  } catch (error) {
    throw error;
  }
};

// Geocode an address to get coordinates
export const geocodeAddress = async (address) => {
  try {
    const maps = await initGoogleMaps();
    
    return new Promise((resolve, reject) => {
      const geocoder = new maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// Reverse geocode coordinates to get address
export const reverseGeocode = async (lat, lng) => {
  try {
    const maps = await initGoogleMaps();
    
    return new Promise((resolve, reject) => {
      const geocoder = new maps.Geocoder();
      
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            address: results[0].formatted_address,
            placeId: results[0].place_id
          });
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// Calculate distance between two points
export const calculateDistance = async (lat1, lng1, lat2, lng2) => {
  try {
    const maps = await initGoogleMaps();
    
    const point1 = new maps.LatLng(lat1, lng1);
    const point2 = new maps.LatLng(lat2, lng2);
    
    return maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000; // Convert to kilometers
  } catch (error) {
    throw error;
  }
};
