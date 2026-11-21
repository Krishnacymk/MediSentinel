// Haversine formula to compute geodesic distance between two points in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Convert distance to readable units (miles and feet)
export function formatDistanceMiles(distanceKm: number): string {
  const miles = distanceKm * 0.621371;
  if (miles < 0.1) {
    const feet = Math.round(miles * 5280);
    return `${feet} ft`;
  }
  return `${miles.toFixed(1)} mi`;
}

// Generate Google Maps navigation URL for driving or walking
export function getDirectionsUrl(
  destinationLat: number,
  destinationLon: number,
  originLat?: number,
  originLon?: number,
  travelMode: 'driving' | 'walking' = 'driving'
): string {
  const dest = `${destinationLat},${destinationLon}`;
  if (originLat !== undefined && originLon !== undefined) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${dest}&travelmode=${travelMode}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=${travelMode}`;
}

// Default demonstration patient coordinates (Manhattan NYC - 427 Maplewood / East Village vicinity)
export const DEFAULT_PATIENT_COORDINATES = {
  latitude: 40.7282,
  longitude: -73.9942,
  cityName: 'Manhattan, New York'
};
