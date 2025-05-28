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

interface OpenCageResult {
  formatted: string;
  components: {
    country?: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
  };
  geometry: {
    lat: number;
    lng: number;
  };
}

interface OpenCageResponse {
  status: {
    code: number;
    message: string;
  };
  results: OpenCageResult[];
  total_results: number;
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
      
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_KEY;
        if (!apiKey) {
          throw new Error('Location search unavailable (API key missing)');
        }

        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(search)}&key=${apiKey}&limit=10&no_annotations=1&min_confidence=5`
        );
        
        const data: OpenCageResponse = await response.json();

        if (data.status?.code === 401 || data.status?.code === 403) {
          throw new Error('Location search unavailable (API key invalid)');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error('Invalid API response format');
        }

        const mappedLocations = data.results.map((result: OpenCageResult) => ({
          id: result.formatted,
          name: result.formatted,
          country: result.components?.country || "",
          state: result.components?.state || "",
          city: result.components?.city || result.components?.town || result.components?.village || "",
          coordinates: {
            lat: result.geometry?.lat || 0,
            lon: result.geometry?.lng || 0
          }
        }));

        if (mappedLocations.length === 0) {
          setLocations([]);
          setError('No locations found');
        } else {
          setLocations(mappedLocations);
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