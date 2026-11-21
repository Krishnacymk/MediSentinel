import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PharmacyMap } from '../components/PharmacyMap';
import {
  Buildings,
  MapPin,
  Compass,
  CheckCircle,
  Phone,
  Clock,
  ShieldCheck,
  FloppyDisk,
  Warning
} from '@phosphor-icons/react';

export const MyStoreLocationPage: React.FC = () => {
  const {
    currentUser,
    pharmacyLocations,
    updatePharmacyLocation,
    addPharmacyLocation
  } = useApp();

  // Find pharmacy for current pharmacist or default to Store A
  const existingStore =
    pharmacyLocations.find(loc => loc.pharmacist_id === currentUser.id) ||
    pharmacyLocations[0];

  const [pharmacyName, setPharmacyName] = useState(existingStore?.pharmacy_name || 'Store A (Metro Care Pharmacy)');
  const [address, setAddress] = useState(existingStore?.address || '104 Broadway, Financial District');
  const [city, setCity] = useState(existingStore?.city || 'New York');
  const [state, setState] = useState(existingStore?.state || 'NY');
  const [postalCode, setPostalCode] = useState(existingStore?.postal_code || '10006');
  const [phoneNumber, setPhoneNumber] = useState(existingStore?.phone_number || '+1 (555) 234 5678');
  const [openingHours, setOpeningHours] = useState(
    existingStore?.opening_hours || 'Monday to Friday: 08:00 to 20:00 • Saturday: 09:00 to 18:00'
  );

  // Exact Coordinates
  const [coordinates, setCoordinates] = useState({
    latitude: existingStore?.latitude || 40.7075,
    longitude: existingStore?.longitude || -74.0113
  });

  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Use GPS to pinpoint pharmacy location automatically
  const handleDetectStoreGps = () => {
    setIsLocating(true);
    setGpsStatus('Accessing hardware GPS coordinates for store location...');

    if (!navigator.geolocation) {
      setGpsStatus('Browser does not support geolocation. Please pinpoint manually on map.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6))
        };
        setCoordinates(newCoords);
        setGpsStatus(`GPS coordinates locked: Lat ${newCoords.latitude}, Lon ${newCoords.longitude}`);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Store geolocation error:', err.message);
        setGpsStatus('Location permission was declined. You can click on the map or enter coordinates manually.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();

    if (existingStore) {
      updatePharmacyLocation({
        ...existingStore,
        pharmacy_name: pharmacyName,
        address,
        city,
        state,
        postal_code: postalCode,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        phone_number: phoneNumber,
        opening_hours: openingHours,
        pharmacist_id: currentUser.id,
        pharmacist_name: currentUser.name
      });
      setSaveSuccess('Medical store location coordinates and business hours updated successfully.');
    } else {
      addPharmacyLocation({
        pharmacy_name: pharmacyName,
        address,
        city,
        state,
        postal_code: postalCode,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        phone_number: phoneNumber,
        opening_hours: openingHours,
        verification_status: 'verified',
        pharmacist_id: currentUser.id,
        pharmacist_name: currentUser.name,
        services: [
          'Prescription Verification',
          'Dispensing Engine',
          'Partial Collection Staging',
          'Photo Handover Evidence'
        ],
        is_sample_data: false
      });
      setSaveSuccess('New medical store registered and broadcast to the patient network.');
    }

    setTimeout(() => setSaveSuccess(''), 3500);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Pharmacist Facility Management
            </span>
            <span className="caption-4 text-neutral-400 font-mono">Store ID: {existingStore?.pharmacy_id || 'PHARM 101'}</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Register and Manage Store Location
          </h1>
          <p className="body-5 text-neutral-400">
            Pinpoint your pharmacy on the interactive map so verified patients can locate your store for safe medicine dispensing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="caption-4 px-3 py-1 rounded-full bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800 font-semibold flex items-center gap-1.5">
            <ShieldCheck size={16} />
            <span>Participating Node Active</span>
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-300 caption-2 flex items-center gap-2">
          <CheckCircle size={18} weight="bold" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* FORM AND INTERACTIVE MAP PICKER */}
      <form onSubmit={handleSaveStore} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="title-3 text-white font-semibold flex items-center gap-2">
              <Buildings size={20} className="text-tealAccent-400" />
              <span>Medical Store Profile</span>
            </h2>

            <div>
              <label className="caption-4 text-neutral-300 block mb-1">Medical Store Name</label>
              <input
                type="text"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                required
                className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
              />
            </div>

            <div>
              <label className="caption-4 text-neutral-300 block mb-1">Complete Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="caption-4 text-neutral-300 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div className="col-span-1">
                <label className="caption-4 text-neutral-300 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div className="col-span-1">
                <label className="caption-4 text-neutral-300 block mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white body-5 font-mono focus:outline-none focus:border-tealAccent-500"
                />
              </div>
            </div>

            <div>
              <label className="caption-4 text-neutral-300 block mb-1">Store Phone Contact</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white body-5 font-mono focus:outline-none focus:border-tealAccent-500"
              />
            </div>

            <div>
              <label className="caption-4 text-neutral-300 block mb-1">Operating Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                required
                className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
              />
            </div>

            {/* Latitude and Longitude Inputs */}
            <div className="bg-dark-base border border-dark-border rounded-xl p-3.5 space-y-2">
              <div className="caption-4 text-tealAccent-400 font-semibold flex items-center justify-between">
                <span>GPS Location Coordinates</span>
                <span className="caption-5 text-neutral-400 font-mono">Precision: 6 decimals</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="caption-5 text-neutral-400 block mb-0.5">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={coordinates.latitude}
                    onChange={(e) =>
                      setCoordinates({ ...coordinates, latitude: Number(e.target.value) })
                    }
                    className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-5 text-neutral-400 block mb-0.5">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={coordinates.longitude}
                    onChange={(e) =>
                      setCoordinates({ ...coordinates, longitude: Number(e.target.value) })
                    }
                    className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleDetectStoreGps}
                disabled={isLocating}
                className="w-full mt-2 button-xsm py-1.5 px-3 rounded-lg bg-dark-card hover:bg-dark-surface border border-dark-border text-tealAccent-300 flex items-center justify-center gap-1.5 transition-hover"
              >
                <Compass size={14} className={isLocating ? 'animate-spin' : ''} />
                <span>Use Current Device GPS Location</span>
              </button>

              {gpsStatus && (
                <div className="caption-5 text-neutral-300 mt-1">{gpsStatus}</div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full button-md py-2.5 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center justify-center gap-2 transition-hover shadow-lg"
              >
                <FloppyDisk size={18} weight="bold" />
                <span>Save Store Location Details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map Pinpoint Picker (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="title-3 text-white font-semibold">
                  Pinpoint Exact Store Location
                </h3>
                <p className="caption-4 text-neutral-400">
                  Click on the map or drag the pin to adjust your store entrance coordinates.
                </p>
              </div>
              <div className="caption-4 font-mono text-tealAccent-400 bg-dark-base px-2.5 py-1 rounded border border-dark-border">
                {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
              </div>
            </div>

            <PharmacyMap
              pharmacies={pharmacyLocations}
              isPickerMode={true}
              pickerCoordinates={coordinates}
              onPickerCoordinatesChange={(newCoords) => setCoordinates(newCoords)}
              className="w-full h-[520px]"
            />

            <div className="mt-4 p-3 rounded-xl bg-dark-base border border-dark-border caption-4 text-neutral-400 flex items-start gap-2">
              <MapPin size={16} className="text-tealAccent-400 mt-0.5 shrink-0" />
              <span>
                Accurate store coordinates ensure patients receive verified distance calculations and seamless Google Maps turn by turn driving and walking directions.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
