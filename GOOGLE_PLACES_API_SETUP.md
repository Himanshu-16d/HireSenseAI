# Google Places API Setup

This application uses the Google Places API for location search functionality. Follow these steps to set up your API key:

## Testing the Google Places API

After setting up your API key (instructions below), you can validate that it's working correctly:

```bash
node scripts/test-google-places-api.js
```

This script will check if your API key is configured correctly and test basic functionality.

## Setting up Google Places API

1. **Create a Google Cloud Project**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable the Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search for and enable the following APIs:
     - Places API
     - Geocoding API
     - Maps JavaScript API

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create credentials" > "API key"
   - Your new API key will be displayed

4. **Restrict the API Key (Recommended)**
   - From the credentials page, find your API key and click "Edit"
   - Under "Application restrictions", choose "HTTP referrers" and add your domain (in development, you can use `localhost`)
   - Under "API restrictions", restrict the key to the Places API, Geocoding API, and Maps JavaScript API
   - Click "Save"

## Setting up in the Application

1. **Create Environment Variables**
   - Create or edit your `.env.local` file in the root of the project
   - Add the following line, replacing `YOUR_API_KEY` with your actual Google API key:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
     ```

2. **For Vercel Deployment**
   - In your Vercel project settings, add the environment variable:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
     ```

## Troubleshooting

- If you encounter "REQUEST_DENIED" errors, make sure your API key is correct and the APIs are enabled.
- If you encounter CORS issues, check that your API key restrictions are configured correctly.
- For billing-related issues, ensure your Google Cloud billing is set up properly.

## Usage Notes

- The Google Places API has usage limits. Check your [Google Cloud Console](https://console.cloud.google.com/) for quota information.
- For high-traffic applications, consider enabling billing to increase your quota.
