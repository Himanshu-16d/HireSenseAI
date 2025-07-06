import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const type = searchParams.get("type") || "autocomplete"; // "autocomplete" or "details"
    const placeId = searchParams.get("placeId");
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      // Fallback to mock data when API key is not available
      console.warn("Google Maps API key not configured, using mock data");
      return getMockLocationData(query, type, placeId);
    }
    
    if (type === "autocomplete" && query) {
      // Call the Places Autocomplete API
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return NextResponse.json(data);
    } 
    else if (type === "details" && placeId) {
      // Call the Place Details API
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,address_component,geometry&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return NextResponse.json(data);
    } 
    else {
      return NextResponse.json(
        { error: "Invalid request parameters" }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in location search API:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// Fallback function to provide mock location data when Google API is not available
function getMockLocationData(query: string | null, type: string, placeId: string | null) {
  if (type === "autocomplete" && query) {
    const mockCities = [
      { description: "Bhopal, Madhya Pradesh, India", place_id: "ChIJX0HMnzD_YjkR-0tLgAQ7oJU" },
      { description: "Mumbai, Maharashtra, India", place_id: "ChIJwe1EZjDG5zsRaYxkjY_tpF0" },
      { description: "Delhi, India", place_id: "ChIJLbZ-NFv9DDkRzk0gTkm3wlI" },
      { description: "Bangalore, Karnataka, India", place_id: "ChIJbU60yXAWrjsR4E9-UejD3_g" },
      { description: "Hyderabad, Telangana, India", place_id: "ChIJH-80GlPZYjkRRg-Ug0M7S9Y" },
      { description: "Chennai, Tamil Nadu, India", place_id: "ChIJYTN9T-plUjoRM9RjaAunYW4" },
      { description: "Kolkata, West Bengal, India", place_id: "ChIJZ_YISduC-DkRvQrF9-ZNCKw" },
      { description: "Pune, Maharashtra, India", place_id: "ChIJARFGZy6_wjsRQ-Oen-Xo8gE" },
      { description: "Ahmedabad, Gujarat, India", place_id: "ChIJSdRbuoqEXjkRFmVPYRHdzk8" },
      { description: "Jaipur, Rajasthan, India", place_id: "ChIJARFGZy6_wjsRQ-Oen-Xo8gE" }
    ];

    const filteredCities = mockCities.filter(city => 
      city.description.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
      status: "OK",
      predictions: filteredCities.map(city => ({
        description: city.description,
        place_id: city.place_id,
        structured_formatting: {
          main_text: city.description.split(',')[0],
          secondary_text: city.description.substring(city.description.indexOf(',') + 2)
        }
      }))
    });
  } else if (type === "details" && placeId) {
    // Mock place details
    return NextResponse.json({
      status: "OK",
      result: {
        name: "Mock Location",
        formatted_address: "Mock Address, India",
        geometry: {
          location: {
            lat: 23.2599,
            lng: 77.4126
          }
        }
      }
    });
  } else {
    return NextResponse.json(
      { error: "Invalid request parameters" }, 
      { status: 400 }
    );
  }
}
