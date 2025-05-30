"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Location {
  id: string;
  name: string;
  country: string;
  state?: string;
  city: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface GooglePlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: Array<{
    offset: number;
    value: string;
  }>;
}

interface GooglePlacesResponse {
  predictions: GooglePlacePrediction[];
  status: string;
}

interface GooglePlaceDetails {
  result: {
    name: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    }
  };
  status: string;
}

const MOCK_LOCATIONS: Location[] = [
  {
    id: "ny",
    name: "New York, NY",
    country: "United States",
    state: "New York",
    city: "New York",
    coordinates: { lat: 40.7128, lon: -74.0060 }
  },
  {
    id: "sf",
    name: "San Francisco, CA",
    country: "United States",
    state: "California",
    city: "San Francisco",
    coordinates: { lat: 37.7749, lon: -122.4194 }
  },
  {
    id: "lon",
    name: "London",
    country: "United Kingdom",
    city: "London",
    coordinates: { lat: 51.5074, lon: -0.1278 }
  },
  // Add more mock locations as needed
]

export function LocationSearch({
  value,
  onChange,
  placeholder = "Search location...",
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchLocations = async () => {
      if (search.length < 2) {
        setLocations([]);
        return;
      }
      
      try {        // Use our server API route to fetch place predictions
        const autocompleteResponse = await fetch(
          `/api/location-search?query=${encodeURIComponent(search)}&type=autocomplete`
        );
        
        if (!autocompleteResponse.ok) {
          throw new Error(`HTTP error! status: ${autocompleteResponse.status}`);
        }
        
        const autocompleteData: GooglePlacesResponse = await autocompleteResponse.json();

        if (autocompleteData.status === 'REQUEST_DENIED' || autocompleteData.status === 'INVALID_REQUEST') {
          throw new Error('Location search unavailable (API key invalid)');
        }

        if (!autocompleteData.predictions || !Array.isArray(autocompleteData.predictions)) {
          throw new Error('Invalid API response format');
        }

        // Process each prediction to get full details
        const mappedLocations = await Promise.all(
          autocompleteData.predictions.slice(0, 5).map(async (prediction: GooglePlacePrediction) => {
            try {
              // Get place details through our server API route
              const detailsResponse = await fetch(
                `/api/location-search?type=details&placeId=${prediction.place_id}`
              );
              
              if (!detailsResponse.ok) {
                return null;
              }
              
              const detailsData: GooglePlaceDetails = await detailsResponse.json();
              
              if (!detailsResponse.ok || detailsData.status !== 'OK') {
                return null;
              }
              
              // Extract country, state, and city from address components
              const addressComponents = detailsData.result.address_components || [];
              const country = addressComponents.find(comp => comp.types.includes('country'))?.long_name || '';
              const state = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || '';
              const city = addressComponents.find(comp => 
                comp.types.includes('locality') || 
                comp.types.includes('administrative_area_level_2')
              )?.long_name || prediction.structured_formatting.main_text;
              
              return {
                id: prediction.place_id,
                name: prediction.description,
                country: country,
                state: state,
                city: city,
                coordinates: {
                  lat: detailsData.result.geometry.location.lat,
                  lon: detailsData.result.geometry.location.lng
                }
              };
            } catch (error) {
              console.error("Error fetching place details:", error);
              return null;
            }
          })
        );

        // Filter out any null values from failed requests
        const validLocations = mappedLocations.filter(location => location !== null) as Location[];        if (validLocations.length === 0) {
          setLocations([]);
          setError('No locations found');
        } else {
          setLocations(validLocations);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch locations';
        
        if (errorMessage.includes('API key')) {
          setError(errorMessage);
          setLocations([]);
        } else {
          setError('Error fetching locations. Using mock data.');
          const filteredLocations = MOCK_LOCATIONS.filter(loc => 
            loc.name.toLowerCase().includes(search.toLowerCase()) ||
            loc.country.toLowerCase().includes(search.toLowerCase()) ||
            (loc.state && loc.state.toLowerCase().includes(search.toLowerCase()))
          );
          setLocations(filteredLocations);
        }
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [search])

  const handleSelect = (location: Location) => {
    setSelectedLocation(location)
    onChange(location.name)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedLocation ? (
              <div className="flex items-center gap-2">
                <span>{selectedLocation.name}</span>
                {selectedLocation.coordinates && (
                  <span className="text-xs text-muted-foreground">
                    ({selectedLocation.coordinates.lat.toFixed(2)}, {selectedLocation.coordinates.lon.toFixed(2)})
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search location..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>
              {error ? (
                <div className="p-2 text-sm text-muted-foreground">{error}</div>
              ) : (
                'No locations found.'
              )}
            </CommandEmpty>
            <CommandGroup>
              {locations.map((location: Location) => (
                <CommandItem
                  key={location.id}
                  value={location.name}
                  onSelect={() => handleSelect(location)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLocation?.id === location.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-xs text-muted-foreground">
                        {location.state}, {location.country}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}