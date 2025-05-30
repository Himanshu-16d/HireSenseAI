# HireSenseAI Background Implementation

This document explains the background implementation used in the HireSenseAI application.

## Overview

The HireSenseAI application uses a static image background (`Background.png`) for all pages. This approach was chosen after experiencing issues with video backgrounds and 3D visualizations in Vercel deployments.

## Implementation Details

### Components Structure

1. **Background Wrapper (`background-wrapper.tsx`)**
   - Client component that dynamically imports the background with `{ ssr: false }`
   - Uses Suspense for better loading experience
   - Serves as the entry point for the background in the layout

2. **Image Background (`image-background.tsx`)**
   - Implements the actual background using Next.js Image component
   - Handles hydration safely with isMounted state
   - Includes preloading for better performance
   - Uses optimized Image component settings

3. **Root Layout Integration**
   - Preloads the background image in the document head
   - Includes the BackgroundWrapper component

## Deployment Considerations

- The background image is cached with a long TTL (31536000 seconds, or 1 year)
- We use optimized Next.js image settings instead of `unoptimized: true`
- The vercel.json file includes a route configuration for caching the background image

## Deprecated Background Implementations

The following background implementations are deprecated and should not be used:

- **VideoBackground**: Used video files that had issues playing in Vercel deployments
- **SplineBackground**: Used 3D Earth visualization that was too resource-intensive
- **StaticBackground**: An earlier attempt at a static background implementation

## Performance Considerations

- Background.png should be properly optimized for web (compressed)
- The image is served with appropriate cache headers
- We use client-side mounting to prevent hydration issues
- The background includes a semi-transparent overlay for better text readability

## Troubleshooting

If you experience issues with the background:

1. Make sure Background.png is present in the public directory
2. Check that the background-wrapper.tsx is correctly importing image-background.tsx
3. Verify that Next.js is properly configured to handle images
4. Test locally and in production to identify environment-specific issues

## Future Improvements

If a video or 3D background is desired in the future, consider:

1. Using a video CDN instead of hosting directly in Vercel
2. Implementing conditional rendering based on device capabilities
3. Providing a static fallback for environments where dynamic backgrounds fail
