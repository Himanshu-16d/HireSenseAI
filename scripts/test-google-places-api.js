'use strict';

// This script is for testing the Google Places API configuration
// Run it with: node scripts/test-google-places-api.js

// Load environment variables
require('dotenv').config();

async function testGooglePlacesAPI() {
  console.log('Testing Google Places API configuration...');
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('ERROR: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable is not set');
    console.log('Please set this variable in your .env file or environment');
    process.exit(1);
  }
  
  console.log('API Key found. Testing Places API autocomplete...');
  
  try {
    // Test query
    const query = 'New York';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Places API Autocomplete is working!');
      console.log(`Found ${data.predictions.length} predictions for "${query}"`);
      console.log('Example prediction:');
      console.log(JSON.stringify(data.predictions[0], null, 2));
      
      // Test Place Details
      if (data.predictions.length > 0) {
        const placeId = data.predictions[0].place_id;
        console.log(`\nTesting Place Details API with place_id: ${placeId}...`);
        
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,address_component,geometry&key=${apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.status === 'OK') {
          console.log('✅ Place Details API is working!');
          console.log('Location details:');
          console.log(`Name: ${detailsData.result.name}`);
          console.log(`Latitude: ${detailsData.result.geometry.location.lat}`);
          console.log(`Longitude: ${detailsData.result.geometry.location.lng}`);
        } else {
          console.error(`❌ Place Details API error: ${detailsData.status}`);
          console.error(detailsData.error_message || 'No error message provided');
        }
      }
    } else {
      console.error(`❌ Places API error: ${data.status}`);
      console.error(data.error_message || 'No error message provided');
    }
  } catch (error) {
    console.error('❌ Error occurred while testing the Google Places API:');
    console.error(error);
  }
}

testGooglePlacesAPI();
