import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const type = searchParams.get("type") || "autocomplete"; // "autocomplete" or "details"
    const placeId = searchParams.get("placeId");
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing" }, 
        { status: 500 }
      );
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
