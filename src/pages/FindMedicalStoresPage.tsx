import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PharmacyMap } from '../components/PharmacyMap';
import { calculateDistanceKm, formatDistanceMiles, getDirectionsUrl, DEFAULT_PATIENT_COORDINATES } from '../utils/geoUtils';
import { PharmacyLocation, UserCoordinates } from '../types';
import {
  MagnifyingGlass,
  MapPin,
  NavigationArrow,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle,
  Funnel,
  ListDashes,
  MapTrifold,
  Info,
  ArrowSquareOut,
  X,
  Compass,
  Buildings
} from '@phosphor-icons/react';

export const FindMedicalStoresPage: React.FC = () => {
  const { pharmacyLocations, userCoordinates, setUserCoordinates } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(true);

  // Selected Pharmacy for Details Slideout
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyLocation | null>(
    pharmacyLocations[0] || null
  );

  // View mode for mobile (map vs list)
  const [mobileView, setMobileView] = useState<'split' | 'map' | 'list'>('split');

  // Geolocation Permission State
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Active Coordinates (Detected or Default Demonstration Coordinates)
  const activeCoordinates: UserCoordinates = useMemo(() => {
    if (userCoordinates) return userCoordinates;
    return {
      latitude: DEFAULT_PATIENT_COORDINATES.latitude,
      longitude: DEFAULT_PATIENT_COORDINATES.longitude
    };
  }, [userCoordinates]);

  // Request GPS Geolocation from Browser
  const handleRequestLocation = () => {
    setIsLocating(true);
    setLocationStatus('Requesting browser location permission...');
    setPermissionDenied(false);

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser. Using regional demonstration coordinates.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: UserCoordinates = {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracyMeters: Math.round(position.coords.accuracy),
          detectedAt: new Date().toISOString()
        };
        setUserCoordinates(coords);
        setLocationStatus('GPS location detected successfully.');
        setIsLocating(false);
        setPermissionDenied(false);
      },
      (error) => {
        console.warn('Geolocation permission declined or unavailable:', error.message);
        setPermissionDenied(true);
        setLocationStatus('Location access permission was declined. Displaying medical stores near Manhattan New York.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Filter and Sort Pharmacies
  const filteredPharmacies = useMemo(() => {
    return pharmacyLocations
      .filter((store) => {
        // Query search against name, address, city, postal code
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          store.pharmacy_name.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query) ||
          store.city.toLowerCase().includes(query) ||
          store.postal_code.toLowerCase().includes(query);

        // Verified filter
        const matchesVerified = !filterVerifiedOnly || store.verification_status === 'verified';

        // Open now filter (e.g. store B is 24 hours)
        const matchesOpen =
          !filterOpenNow ||
          store.opening_hours.toLowerCase().includes('24 hours') ||
          store.opening_hours.toLowerCase().includes('open');

        return matchesQuery && matchesVerified && matchesOpen;
      })
      .map((store) => {
        const distanceKm = calculateDistanceKm(
          activeCoordinates.latitude,
          activeCoordinates.longitude,
          store.latitude,
          store.longitude
        );
        return {
          ...store,
          distanceKm
        };
      })
      .sort((a, b) => {
        if (sortByDistance) {
          return a.distanceKm - b.distanceKm;
        }
        return a.pharmacy_name.localeCompare(b.pharmacy_name);
      });
  }, [pharmacyLocations, searchQuery, filterVerifiedOnly, filterOpenNow, sortByDistance, activeCoordinates]);

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Patient Location Services
            </span>
            <span className="caption-4 text-neutral-400">Module 11 • GPS Mapping</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Find Participating Medical Stores
          </h1>
          <p className="body-5 text-neutral-400">
            Locate accredited pharmacies near you to collect prescribed medicines, manage partial refills, and access clinical support.
          </p>
        </div>

        {/* GPS Permission Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="button-sm py-2 px-3 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-2 transition-hover shadow-md"
          >
            <Compass size={16} weight="bold" className={isLocating ? 'animate-spin' : ''} />
            <span>{userCoordinates ? 'Update My GPS Location' : 'Detect My GPS Location'}</span>
          </button>
        </div>
      </div>

      {/* GPS Location Status & Privacy Notice */}
      <div className="mb-6 p-4 rounded-xl bg-dark-card border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-300">
          <span className={`w-2.5 h-2.5 rounded-full ${userCoordinates ? 'bg-tealAccent-500 animate-pulse' : 'bg-yellow-500'}`}></span>
          <span>
            {userCoordinates
              ? `GPS detected: Lat ${userCoordinates.latitude.toFixed(4)}, Lon ${userCoordinates.longitude.toFixed(4)}`
              : 'Using regional default: Manhattan New York area. Click Detect GPS to pinpoint exact coordinates.'}
          </span>
        </div>

        <div className="flex items-center gap-2 caption-5 text-neutral-400">
          <ShieldCheck size={16} className="text-tealAccent-400" />
          <span>Patient coordinates are used strictly on device for distance calculation and never stored without consent.</span>
        </div>
      </div>

      {locationStatus && (
        <div className={`mb-6 p-3 rounded-xl caption-2 ${permissionDenied ? 'bg-alertWarn-bg border border-alertWarn-border text-alertWarn-text' : 'bg-dark-base border border-dark-border text-tealAccent-300'}`}>
          {locationStatus}
        </div>
      )}

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-4 mb-6 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by store name, address, area, or postal code (e.g. 10006)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-base border border-dark-border rounded-xl pl-9 pr-4 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500 font-mono text-xs"
          />
          <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-neutral-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
            className={`caption-3 py-1.5 px-3 rounded-lg border transition-hover flex items-center gap-1.5 ${
              filterVerifiedOnly
                ? 'bg-tealAccent-950 border-tealAccent-600 text-tealAccent-300 font-semibold'
                : 'bg-dark-base border-dark-border text-neutral-300 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Verified Participating Only</span>
          </button>

          <button
            onClick={() => setFilterOpenNow(!filterOpenNow)}
            className={`caption-3 py-1.5 px-3 rounded-lg border transition-hover flex items-center gap-1.5 ${
              filterOpenNow
                ? 'bg-tealAccent-950 border-tealAccent-600 text-tealAccent-300 font-semibold'
                : 'bg-dark-base border-dark-border text-neutral-300 hover:text-white'
            }`}
          >
            <Clock size={14} />
            <span>Open Now</span>
          </button>

          <button
            onClick={() => setSortByDistance(!sortByDistance)}
            className={`caption-3 py-1.5 px-3 rounded-lg border transition-hover flex items-center gap-1.5 ${
              sortByDistance
                ? 'bg-dark-surface border-neutral-500 text-white font-semibold'
                : 'bg-dark-base border-dark-border text-neutral-400'
            }`}
          >
            <NavigationArrow size={14} />
            <span>{sortByDistance ? 'Sorted by Distance' : 'Sorted Alphabetical'}</span>
          </button>

          {/* Mobile view switchers */}
          <div className="lg:hidden flex items-center rounded-lg border border-dark-border bg-dark-base p-0.5 ml-auto">
            <button
              onClick={() => setMobileView('map')}
              className={`p-1.5 rounded caption-4 ${mobileView === 'map' ? 'bg-tealAccent-600 text-white' : 'text-neutral-400'}`}
              title="Show map view"
            >
              <MapTrifold size={16} />
            </button>
            <button
              onClick={() => setMobileView('list')}
              className={`p-1.5 rounded caption-4 ${mobileView === 'list' ? 'bg-tealAccent-600 text-white' : 'text-neutral-400'}`}
              title="Show list view"
            >
              <ListDashes size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT VIEW: PHARMACY LIST & INTERACTIVE MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pharmacy Cards List (5 Cols) */}
        <div className={`lg:col-span-5 space-y-3 ${mobileView === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between caption-4 text-neutral-400 mb-1 px-1">
            <span>{filteredPharmacies.length} Medical Stores Found</span>
            <span className="caption-5 font-mono">Sample Demonstration Network</span>
          </div>

          {filteredPharmacies.length === 0 ? (
            <div className="p-8 rounded-2xl bg-dark-card border border-dark-border text-center text-neutral-400 caption-2">
              No medical stores match your search or filter parameters. Try expanding your search area or removing filters.
            </div>
          ) : (
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredPharmacies.map((store) => {
                const isSelected = selectedPharmacy?.pharmacy_id === store.pharmacy_id;
                const isVerified = store.verification_status === 'verified';

                return (
                  <div
                    key={store.pharmacy_id}
                    onClick={() => setSelectedPharmacy(store)}
                    className={`p-4 rounded-xl border cursor-pointer transition-base text-left ${
                      isSelected
                        ? 'bg-dark-base border-tealAccent-500 shadow-xl ring-1 ring-tealAccent-500'
                        : 'bg-dark-card border-dark-border hover:border-neutral-500 hover:bg-dark-surface/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="title-4 text-white font-semibold flex items-center gap-1.5">
                          <span>{store.pharmacy_name}</span>
                          {store.is_sample_data && (
                            <span className="caption-5 px-1.5 py-0.2 rounded bg-dark-surface text-neutral-400 font-mono">
                              Sample
                            </span>
                          )}
                        </div>
                        <div className="caption-5 font-mono text-neutral-400">{store.address}, {store.city} {store.postal_code}</div>
                      </div>

                      <div className="text-right">
                        <span className="caption-4 text-tealAccent-400 font-bold font-mono block">
                          {formatDistanceMiles(store.distanceKm)}
                        </span>
                        <span className={`caption-5 px-1.5 py-0.2 rounded font-semibold capitalize ${isVerified ? 'bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800' : 'bg-alertWarn-bg text-alertWarn-text border border-alertWarn-border'}`}>
                          {store.verification_status}
                        </span>
                      </div>
                    </div>

                    <div className="caption-4 text-neutral-300 mt-2 flex items-center gap-1.5">
                      <Clock size={13} className="text-neutral-400" />
                      <span>{store.opening_hours}</span>
                    </div>

                    <div className="caption-4 text-neutral-400 mt-1 flex items-center gap-1.5">
                      <Phone size={13} />
                      <span className="font-mono">{store.phone_number}</span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-dark-border flex items-center justify-between text-xs">
                      <span className="caption-5 text-neutral-400">Lead: {store.pharmacist_name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPharmacy(store);
                        }}
                        className="caption-4 text-tealAccent-400 hover:underline font-semibold"
                      >
                        Store details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Leaflet Map (7 Cols) */}
        <div className={`lg:col-span-7 flex flex-col gap-4 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <PharmacyMap
            pharmacies={filteredPharmacies}
            selectedPharmacyId={selectedPharmacy?.pharmacy_id}
            onSelectPharmacy={(store) => setSelectedPharmacy(store)}
            patientLocation={userCoordinates}
            className="w-full h-[480px] lg:h-[580px]"
          />

          {/* Detailed Selected Store Information Panel */}
          {selectedPharmacy && (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl transition-base">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-border mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="title-2 text-white font-semibold">
                      {selectedPharmacy.pharmacy_name}
                    </span>
                    <span className={`caption-5 px-2 py-0.5 rounded font-semibold capitalize ${selectedPharmacy.verification_status === 'verified' ? 'bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800' : 'bg-alertWarn-bg text-alertWarn-text border border-alertWarn-border'}`}>
                      {selectedPharmacy.verification_status} Store
                    </span>
                  </div>
                  <div className="caption-3 text-neutral-300">
                    {selectedPharmacy.address}, {selectedPharmacy.city}, {selectedPharmacy.state} {selectedPharmacy.postal_code}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <a
                    href={getDirectionsUrl(
                      selectedPharmacy.latitude,
                      selectedPharmacy.longitude,
                      activeCoordinates.latitude,
                      activeCoordinates.longitude,
                      'driving'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-sm py-2 px-3 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-1.5 transition-hover shadow-md"
                  >
                    <NavigationArrow size={16} weight="bold" />
                    <span>Get Directions</span>
                  </a>

                  <a
                    href={`tel:${selectedPharmacy.phone_number}`}
                    className="button-sm py-2 px-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border text-white flex items-center gap-1.5 transition-hover"
                  >
                    <Phone size={16} />
                    <span>Call Store</span>
                  </a>
                </div>
              </div>

              {/* Information Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
                <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
                  <span className="caption-5 text-neutral-400 block mb-0.5">Estimated Distance</span>
                  <span className="title-4 text-tealAccent-400 font-bold font-mono">
                    {formatDistanceMiles(
                      calculateDistanceKm(
                        activeCoordinates.latitude,
                        activeCoordinates.longitude,
                        selectedPharmacy.latitude,
                        selectedPharmacy.longitude
                      )
                    )}
                  </span>
                  <span className="caption-5 text-neutral-400 block mt-0.5">Calculated from coordinates</span>
                </div>

                <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
                  <span className="caption-5 text-neutral-400 block mb-0.5">Supervising Pharmacist</span>
                  <span className="title-4 text-white font-bold truncate block">
                    {selectedPharmacy.pharmacist_name}
                  </span>
                  <span className="caption-5 text-neutral-400 block mt-0.5">Verified License Node</span>
                </div>

                <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
                  <span className="caption-5 text-neutral-400 block mb-0.5">Hours of Service</span>
                  <span className="caption-3 text-neutral-200 block truncate">
                    {selectedPharmacy.opening_hours}
                  </span>
                  <span className="caption-5 text-neutral-400 block mt-0.5">Participating location</span>
                </div>
              </div>

              {/* Services Available at this Store */}
              <div>
                <span className="caption-4 text-neutral-400 block mb-2 font-medium">
                  Verified In Store Clinical Services:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedPharmacy.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="caption-4 px-2.5 py-1 rounded-lg bg-dark-base border border-dark-border text-neutral-300 flex items-center gap-1.5"
                    >
                      <CheckCircle size={13} className="text-tealAccent-400" />
                      <span>{service}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance & Inventory Notice */}
              <div className="mt-4 pt-3 border-t border-dark-border flex items-start gap-2 caption-5 text-neutral-400">
                <Info size={15} className="text-tealAccent-400 mt-0.5 shrink-0" />
                <span>
                  Inventory verification: Specific medication stock varies throughout the day. Please contact the pharmacist before visiting to confirm active batch availability.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
