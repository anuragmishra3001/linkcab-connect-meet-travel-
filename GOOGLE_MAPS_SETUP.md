# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the LinkCab application.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console

## Step 1: Enable Google Maps APIs

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Library"
4. Search for and enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**

## Step 2: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 3: Restrict API Key (Recommended)

1. Click on the created API key to edit it
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s):
   - `localhost:5173/*` (for development)
   - `yourdomain.com/*` (for production)
4. Under "API restrictions", select "Restrict key"
5. Select the APIs you enabled in Step 1
6. Click "Save"

## Step 4: Update Application

1. Open `index.html` in your project
2. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

## Step 5: Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env` file in your project root
2. Add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key
   ```
3. Update `index.html` to use the environment variable:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=%VITE_GOOGLE_MAPS_API_KEY%&libraries=places"></script>
   ```

## Features Included

The Google Maps integration includes:

### 1. **MapPicker Component**
- Interactive map with click-to-select functionality
- Address autocomplete with Google Places
- Reverse geocoding for map clicks
- Draggable markers
- Location validation

### 2. **LocationAutocomplete Component**
- Address autocomplete without map
- Place suggestions as you type
- Location validation
- Clear functionality

### 3. **Utility Functions**
- `createAutocomplete()` - Initialize Places autocomplete
- `createMap()` - Create interactive map
- `addMarker()` - Add markers to map
- `geocodeAddress()` - Convert address to coordinates
- `reverseGeocode()` - Convert coordinates to address
- `calculateDistance()` - Calculate distance between points

## Usage Examples

### MapPicker (Full Map Interface)
```jsx
<MapPicker
  onLocationSelect={(location) => {
    console.log('Selected:', location.lat, location.lng, location.address)
  }}
  placeholder="Search for a location..."
/>
```

### LocationAutocomplete (Simple Input)
```jsx
<LocationAutocomplete
  onLocationSelect={(location) => {
    console.log('Selected:', location.lat, location.lng, location.address)
  }}
  placeholder="Enter location..."
/>
```

## Configuration Options

### MapPicker Props
- `onLocationSelect` - Callback when location is selected
- `initialLocation` - Pre-selected location object
- `placeholder` - Input placeholder text
- `className` - Additional CSS classes

### LocationAutocomplete Props
- `onLocationSelect` - Callback when location is selected
- `placeholder` - Input placeholder text
- `className` - Additional CSS classes
- `required` - Make input required
- `value` - Controlled input value
- `onChange` - Input change handler

## Troubleshooting

### Common Issues

1. **"Google Maps API error: RefererNotAllowedMapError"**
   - Check your API key restrictions
   - Ensure your domain is added to allowed referrers

2. **"Places API not enabled"**
   - Enable Places API in Google Cloud Console

3. **"Geocoding API not enabled"**
   - Enable Geocoding API in Google Cloud Console

4. **Map not loading**
   - Check browser console for errors
   - Verify API key is correct
   - Ensure all required APIs are enabled

### Debug Mode

To enable debug mode, add `&libraries=places&v=beta` to the script URL:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places&v=beta"></script>
```

## Cost Considerations

- **Maps JavaScript API**: Free tier includes 28,500 map loads per month
- **Places API**: Free tier includes 1,000 requests per day
- **Geocoding API**: Free tier includes 2,500 requests per day

Monitor your usage in the Google Cloud Console to avoid unexpected charges.

## Security Best Practices

1. **Restrict API Key**: Always restrict your API key to specific domains
2. **Use Environment Variables**: Don't commit API keys to version control
3. **Monitor Usage**: Set up billing alerts in Google Cloud Console
4. **Regular Review**: Periodically review and update API restrictions

## Support

For Google Maps API support:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps Platform Support](https://developers.google.com/maps/support)
