import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PharmacyLocation, UserCoordinates } from '../types';

interface PharmacyMapProps {
  pharmacies: PharmacyLocation[];
  selectedPharmacyId?: string | null;
  onSelectPharmacy?: (pharmacy: PharmacyLocation) => void;
  patientLocation?: UserCoordinates | null;
  // Picker mode for pharmacist location registration
  isPickerMode?: boolean;
  pickerCoordinates?: { latitude: number; longitude: number };
  onPickerCoordinatesChange?: (coords: { latitude: number; longitude: number }) => void;
  className?: string;
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({
  pharmacies,
  selectedPharmacyId,
  onSelectPharmacy,
  patientLocation,
  isPickerMode = false,
  pickerCoordinates,
  onPickerCoordinatesChange,
  className = 'w-full h-full min-h-[400px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const patientMarkerRef = useRef<L.Marker | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center: Manhattan NYC
    const defaultCenter: [number, number] = [40.7306, -73.9950];
    const initialZoom = 13;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true
    });

    // Dark Matter tile layer for healthcare dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Handle map resize on container changes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Pharmacy Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    pharmacies.forEach((pharmacy) => {
      const isSelected = selectedPharmacyId === pharmacy.pharmacy_id;
      const isVerified = pharmacy.verification_status === 'verified';

      // Custom DivIcon with SVG badge
      const iconHtml = `
        <div class="relative cursor-pointer transition-transform duration-300 hover:scale-110">
          <div class="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${
            isSelected
              ? 'bg-tealAccent-500 border-white ring-4 ring-tealAccent-500/40'
              : isVerified
              ? 'bg-dark-base border-tealAccent-500 text-tealAccent-400'
              : 'bg-dark-base border-alertWarn-text text-alertWarn-text'
          }">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
              <path d="M240,104a8,8,0,0,1-16,0,88,88,0,0,0-176,0,8,8,0,0,1-16,0,104,104,0,0,1,208,0ZM128,40a8,8,0,0,0-8,8V120H48a8,8,0,0,0,0,16h72v72a8,8,0,0,0,16,0V136h72a8,8,0,0,0,0-16H136V48A8,8,0,0,0,128,40Z"/>
            </svg>
          </div>
          ${
            isSelected
              ? '<span class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white"></span>'
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-pharmacy-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([pharmacy.latitude, pharmacy.longitude], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div class="bg-dark-card text-neutral-200 p-2 font-sans text-xs min-w-[180px]">
          <div class="font-bold text-white text-sm mb-0.5">${pharmacy.pharmacy_name}</div>
          <div class="text-neutral-400 mb-1">${pharmacy.address}</div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="inline-block w-2 h-2 rounded-full ${isVerified ? 'bg-tealAccent-500' : 'bg-yellow-500'}"></span>
            <span class="text-tealAccent-300 capitalize font-medium">${pharmacy.verification_status}</span>
          </div>
          <div class="text-neutral-400 font-mono text-[11px]">${pharmacy.phone_number}</div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-leaflet-popup',
        closeButton: false
      });

      marker.on('click', () => {
        if (onSelectPharmacy) {
          onSelectPharmacy(pharmacy);
        }
      });

      markersLayer.addLayer(marker);

      // If selected, auto pan to it
      if (isSelected) {
        map.panTo([pharmacy.latitude, pharmacy.longitude], {
          animate: true,
          duration: 0.8
        });
      }
    });
  }, [pharmacies, selectedPharmacyId, onSelectPharmacy]);

  // Update Patient GPS Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (patientMarkerRef.current) {
      map.removeLayer(patientMarkerRef.current);
      patientMarkerRef.current = null;
    }

    if (patientLocation) {
      const patientIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-blue-500/30 animate-ping absolute"></div>
          <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white relative z-10">
            <span class="w-2 h-2 rounded-full bg-white"></span>
          </div>
        </div>
      `;

      const patientIcon = L.divIcon({
        html: patientIconHtml,
        className: 'custom-patient-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([patientLocation.latitude, patientLocation.longitude], {
        icon: patientIcon
      }).addTo(map);

      marker.bindTooltip('Your Current Location', {
        permanent: false,
        direction: 'top',
        className: 'custom-leaflet-tooltip'
      });

      patientMarkerRef.current = marker;

      // Pan to patient location initially if not viewing a specific pharmacy
      if (!selectedPharmacyId && !isPickerMode) {
        map.setView([patientLocation.latitude, patientLocation.longitude], 14, {
          animate: true
        });
      }
    }
  }, [patientLocation, selectedPharmacyId, isPickerMode]);

  // Picker Mode for Pharmacist Registration
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isPickerMode) return;

    const currentCoords: [number, number] = pickerCoordinates
      ? [pickerCoordinates.latitude, pickerCoordinates.longitude]
      : [40.7075, -74.0113];

    if (!pickerMarkerRef.current) {
      const pickerIconHtml = `
        <div class="relative cursor-move">
          <div class="w-10 h-10 rounded-full bg-tealAccent-500 border-2 border-white shadow-2xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
              <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,202.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/>
            </svg>
          </div>
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white"></span>
        </div>
      `;

      const pickerIcon = L.divIcon({
        html: pickerIconHtml,
        className: 'custom-picker-pin',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = L.marker(currentCoords, {
        icon: pickerIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', () => {
        const latLng = marker.getLatLng();
        if (onPickerCoordinatesChange) {
          onPickerCoordinatesChange({
            latitude: Number(latLng.lat.toFixed(6)),
            longitude: Number(latLng.lng.toFixed(6))
          });
        }
      });

      pickerMarkerRef.current = marker;
      map.setView(currentCoords, 15);
    } else {
      pickerMarkerRef.current.setLatLng(currentCoords);
    }

    // Map click handler to set marker
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng(e.latlng);
      }
      if (onPickerCoordinatesChange) {
        onPickerCoordinatesChange({
          latitude: Number(e.latlng.lat.toFixed(6)),
          longitude: Number(e.latlng.lng.toFixed(6))
        });
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isPickerMode, pickerCoordinates, onPickerCoordinatesChange]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-dark-border bg-dark-card ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-10 bg-dark-base/90 backdrop-blur-md border border-dark-border rounded-xl p-2.5 shadow-xl caption-5 flex flex-col gap-1.5 text-neutral-300 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-tealAccent-500 border border-white"></span>
          <span>Verified Pharmacy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-alertWarn-text border border-white"></span>
          <span>Pending Verification</span>
        </div>
        {patientLocation && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 border border-white animate-pulse"></span>
            <span>Your Location</span>
          </div>
        )}
      </div>

      {isPickerMode && (
        <div className="absolute top-3 left-3 z-10 bg-dark-base/90 backdrop-blur-md border border-tealAccent-700/80 rounded-xl px-3 py-2 shadow-xl caption-4 text-tealAccent-300">
          Click map or drag the pin to set store coordinates
        </div>
      )}
    </div>
  );
};
