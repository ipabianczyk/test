import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, MapPin, Phone, Mail, Navigation, Info, 
  Layers, Map, Heart, AlertCircle, Shield, Scale, HelpCircle 
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Import facilities JSON directly
import placowkiRaw from '../data/placowki_2.json';

// Interfaces
interface FacilityDetails {
  wojewodztwo: string;
  powiat: string;
  gmina: string;
  miejscowosc: string;
  bytowe?: string;
  kryzys?: string;
  prawo?: string;
  zdrowie?: string;
}

interface FacilityJSON {
  [key: string]: FacilityDetails;
}

// Transform the records to a fully queryable list of individual services
interface UnifiedService {
  id: string;
  cityKey: string;
  cityLabel: string;
  wojewodztwo: string;
  powiat: string;
  gmina: string;
  type: 'bytowe' | 'kryzys' | 'prawo' | 'zdrowie';
  typeLabel: string;
  email: string;
  lat: number;
  lng: number;
}

// Voivodeship centers for realistic falling back of coordinates
const VOIVODESHIP_CENTERS: Record<string, [number, number]> = {
  'dolnośląskie': [51.1079, 17.0385],
  'kujawsko-pomorskie': [53.0138, 18.5984],
  'lubelskie': [51.2465, 22.5684],
  'lubuskie': [51.9356, 15.5062],
  'łódzkie': [51.7592, 19.4486],
  'małopolskie': [50.0647, 19.9450],
  'mazowieckie': [52.2297, 21.0122],
  'opolskie': [50.6751, 17.9213],
  'podkarpackie': [50.0413, 21.9990],
  'podlaskie': [53.1325, 23.1688],
  'pomorskie': [54.3520, 18.6466],
  'śląskie': [50.2649, 19.0238],
  'świętokrzyskie': [50.8660, 20.6286],
  'warmińsko-mazurskie': [53.7784, 20.4801],
  'wielkopolskie': [52.4064, 16.9252],
  'zachodniopomorskie': [53.4285, 14.5528]
};

// Exact coordinates for primary cities to render perfectly
const EXACT_CITY_COORDS: Record<string, [number, number]> = {
  'sosnowiec': [50.2862, 19.1040],
  'katowice': [50.2649, 19.0238],
  'dąbrowa górnicza': [50.3206, 19.1868],
  'gliwice': [50.2976, 18.6766],
  'bytom': [50.3480, 18.9328],
  'jelenia góra': [50.9044, 15.7276],
  'legnica': [51.2070, 16.1527],
  'wrocław-stare miasto': [51.1079, 17.0385],
  'kruszyn': [52.6133, 19.0617],
  'bolesławiec': [51.2631, 15.5644],
  'lublin': [51.2465, 22.5684],
  'rzeszów': [50.0413, 21.9990],
  'gdańsk': [54.3520, 18.6466],
  'gdynia': [54.5189, 18.5305],
  'sopot': [54.4418, 18.5601],
  'białystok': [53.1325, 23.1688],
  'olsztyn': [53.7784, 20.4801],
  'kielce': [50.8660, 20.6286],
  'radom': [51.4027, 21.1471],
  'siedlce': [52.1671, 22.2902],
  'elbląg': [54.1561, 19.4045],
  'mielec': [50.2882, 21.4233],
  'suwałki': [54.0978, 22.9298]
};

// Simple deterministic hash for coordinate offsets so cities don't overlap in one spot
function getDeterministicOffset(name: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = ((Math.abs(hash) % 100) / 450) - 0.11;
  const lngOffset = (((Math.abs(hash) >> 4) % 100) / 450) - 0.11;
  return [latOffset, lngOffset];
}

// Colors from criteria
const MARKER_COLORS = {
  kryzys: { hex: '#C97A63', bg: 'bg-[#C97A63]', border: 'border-[#AB614C]', text: 'text-[#C97A63]', label: 'Kryzys i InterwencjaDomowa' },
  prawo: { hex: '#4A5D4E', bg: 'bg-[#4A5D4E]', border: 'border-[#3D4C40]', text: 'text-[#4A5D4E]', label: 'Prawo / Świadczenia' },
  zdrowie: { hex: '#3B82F6', bg: 'bg-[#3B82F6]', border: 'border-[#1D4ED8]', text: 'text-[#3B82F6]', label: 'Zdrowie i Onkologia' },
  bytowe: { hex: '#D97706', bg: 'bg-[#D97706]', border: 'border-[#B45309]', text: 'text-[#D97706]', label: 'Bytowe i Środki MOPS' }
};

// Custom DivIcon creator avoiding broken Leaflet image bundles
function createCustomMarkerIcon(type: 'bytowe' | 'kryzys' | 'prawo' | 'zdrowie', isSelected = false) {
  const config = MARKER_COLORS[type];
  const sizeClass = isSelected ? 'w-10 h-10' : 'w-7 h-7';
  const pulseClass = type === 'kryzys' ? 'animate-pulse' : '';
  const selectedRing = isSelected ? 'ring-4 ring-black/20 ring-offset-2 scale-120' : '';

  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center ${sizeClass} transition-all duration-300 transform">
        <div class="absolute ${sizeClass} rounded-full opacity-35 ${config.bg} ${pulseClass}"></div>
        <div class="${isSelected ? 'w-6 h-6' : 'w-4.5 h-4.5'} rounded-full ${config.bg} border-2 border-white shadow-md flex items-center justify-center ${selectedRing}">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    className: 'custom-leaflet-marker',
    iconSize: isSelected ? [40, 40] : [28, 28],
    iconAnchor: isSelected ? [20, 20] : [14, 14]
  });
}

// User location marker
const createUserIcon = () => L.divIcon({
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="absolute w-8 h-8 rounded-full bg-blue-400 opacity-40 animate-ping"></div>
      <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"></div>
    </div>
  `,
  className: 'user-location-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Component to dynamically alter Leaflet position
function CenterMapHandler({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

export default function MapaLeafletView() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedVoivodeship, setSelectedVoivodeship] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([52.0693, 19.4803]); // Center of Poland
  const [mapZoom, setMapZoom] = useState(6);
  const [selectedService, setSelectedService] = useState<UnifiedService | null>(null);

  // User position from navigator.geolocation
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Transform raw hierarchical JSON to flattened services with coordinates
  const transformedServices = useMemo<UnifiedService[]>(() => {
    const data = placowkiRaw as FacilityJSON;
    const servicesList: UnifiedService[] = [];

    Object.entries(data).forEach(([cityKey, details]) => {
      // Find coordinates based on precise lookup table
      let rawCoords = EXACT_CITY_COORDS[cityKey.toLowerCase()];
      
      if (!rawCoords) {
        // Fallback: Use voivodeship center with deterministic name offset
        const center = VOIVODESHIP_CENTERS[details.wojewodztwo.toLowerCase()];
        if (center) {
          const [offsetLat, offsetLng] = getDeterministicOffset(cityKey);
          rawCoords = [center[0] + offsetLat, center[1] + offsetLng];
          // TODO: Add coordinates for: [cityKey]
        } else {
          // Absolute fallback to center of Poland
          const [offsetLat, offsetLng] = getDeterministicOffset(cityKey);
          rawCoords = [52.0693 + offsetLat, 19.4803 + offsetLng];
        }
      }

      const types: Array<'bytowe' | 'kryzys' | 'prawo' | 'zdrowie'> = ['bytowe', 'kryzys', 'prawo', 'zdrowie'];
      types.forEach((type) => {
        const email = details[type];
        if (email && email.trim() !== '') {
          servicesList.push({
            id: `${cityKey}-${type}`,
            cityKey,
            cityLabel: details.miejscowosc,
            wojewodztwo: details.wojewodztwo,
            powiat: details.powiat,
            gmina: details.gmina,
            type,
            typeLabel: MARKER_COLORS[type].label,
            email,
            lat: rawCoords[0],
            lng: rawCoords[1]
          });
        }
      });
    });

    return servicesList;
  }, []);

  // Filter lists of voivodeships for filters dropdown
  const voivodeships = useMemo(() => {
    const set = new Set<string>();
    transformedServices.forEach(s => set.add(s.wojewodztwo));
    return Array.from(set).sort();
  }, [transformedServices]);

  // Apply search query, category, and province filters
  const filteredServices = useMemo(() => {
    return transformedServices.filter((service) => {
      const matchesType = selectedType === 'all' || service.type === selectedType;
      const matchesVoivodeship = selectedVoivodeship === 'all' || service.wojewodztwo === selectedVoivodeship;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = query === '' ||
        service.cityLabel.toLowerCase().includes(query) ||
        service.wojewodztwo.toLowerCase().includes(query) ||
        service.powiat.toLowerCase().includes(query) ||
        service.gmina.toLowerCase().includes(query) ||
        service.email.toLowerCase().includes(query);

      return matchesType && matchesVoivodeship && matchesQuery;
    });
  }, [transformedServices, selectedType, selectedVoivodeship, searchQuery]);

  // Request browser Geo-position
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError('Twoja przeglądarka nie wspiera geolokalizacji.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setMapZoom(13); // Zoom-in on user
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Odmowa dostępu do lokalizacji. Odblokuj uprawnienia w przeglądarce.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Informacje o lokalizacji są niedostępne.');
            break;
          case error.TIMEOUT:
            setLocationError('Przekroczono limit czasu żądania.');
            break;
          default:
            setLocationError('Nie udało się pobrać Twojej lokalizacji.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Center mapping on specific facility card select
  const selectFacility = (service: UnifiedService) => {
    setSelectedService(service);
    setMapCenter([service.lat, service.lng]);
    setMapZoom(13);
  };

  return (
    <div className="bg-[#FBF9F4] min-h-screen text-[#1a211e] font-sans antialiased pb-12">
      {/* Search and interactive filter sidebar overlay container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 space-y-8">
        <div>
          <span className="text-[#6B7280] font-black text-[10px] uppercase tracking-[0.25em] block mb-3">
            MostPomocy.pl / Mapa Ogólnokrajowa
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0f1412] leading-tight">
            Interaktywna Mapa Placówek
          </h1>
          <p className="text-[#1a211e] text-xs md:text-sm leading-relaxed max-w-3xl mt-2">
            Wyszukuj i filtruj spośród setek zweryfikowanych placówek socjalnych, interwencyjnych i zdrowotnych w całej Polsce. 
            Jasny, bezpieczny dla oczu podkład CartoDB nie przytłacza kolorami, a precyzyjne odnośniki ułatwiają bezpośredni kontakt.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[620px]">
          
          {/* LEFT COLUMN: Filtering panel & List view (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Filters panel */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-5 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0f1412] mb-1">
                Filtrowanie i Lokalizacja
              </h2>

              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Wyszukaj miasto, gmine lub mail..."
                    className="w-full bg-[#FAF8F4] pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-black focus:outline-none focus:border-black transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-black uppercase text-slate-400 hover:text-black"
                    >
                      X
                    </button>
                  )}
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Category Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Typ Pomocy
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-[#FAF8F4] p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-black focus:outline-none focus:border-black min-h-[38px]"
                    >
                      <option value="all">📁 Wszystkie typy</option>
                      <option value="kryzys">🟠 Kryzys / Przemoc</option>
                      <option value="prawo">🟢 Prawo / Alimenty</option>
                      <option value="zdrowie">🔵 Medycyna / Zdrowie</option>
                      <option value="bytowe">🟡 Bytowe / MOPS</option>
                    </select>
                  </div>

                  {/* Voivodeship Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Województwo
                    </label>
                    <select
                      value={selectedVoivodeship}
                      onChange={(e) => setSelectedVoivodeship(e.target.value)}
                      className="w-full bg-[#FAF8F4] p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-black focus:outline-none focus:border-black min-h-[38px]"
                    >
                      <option value="all">🗺️ Cała Polska</option>
                      {voivodeships.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Geolocation Button "Znajdź mnie" */}
                <div>
                  <button
                    type="button"
                    onClick={handleLocateUser}
                    disabled={isLocating}
                    className="w-full bg-[#0f1412] hover:bg-black text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    {isLocating ? 'Lokalizowanie...' : 'Znajdź moją lokalizację (GPS)'}
                  </button>

                  {locationError && (
                    <div className="mt-2.5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-[11px] text-red-800 leading-tight">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{locationError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* List scrollbox of matching locations */}
            <div className="flex-1 overflow-y-auto no-scrollbar max-h-[420px] lg:max-h-[460px] space-y-3 bg-white border border-slate-200 rounded-[24px] p-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#6b7280]">
                  Dopasowania ({filteredServices.length})
                </span>
                <span className="text-[10px] bg-[#FAF8F4] text-slate-600 px-2 py-0.5 rounded-md font-bold">
                  {selectedVoivodeship !== 'all' ? selectedVoivodeship : 'Kraj'}
                </span>
              </div>

              {filteredServices.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <span className="text-2xl filter drop-shadow-xs block">🛰️</span>
                  <h3 className="font-serif font-black text-xs text-[#0f1412]">Brak dopasowań do filtrów</h3>
                  <p className="text-[11px] text-[#6b7280] max-w-xs mx-auto">
                    Spróbuj wyszukać inną gmine lub wyczyść filtry, aby zlokalizować najbliższe placówki wsparcia.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredServices.slice(0, 100).map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const config = MARKER_COLORS[service.type];
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => selectFacility(service)}
                        className={`w-full text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-[#FBF9F4] border-black ring-1 ring-black/5 shadow-xs' 
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1.5 w-full">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-serif font-black text-xs text-[#0f1412] leading-tight truncate max-w-[200px]">
                              {service.cityLabel}
                            </h4>
                            <span className={`text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${config.text} ${config.bg}/5 border-${service.type === 'bytowe' ? 'amber' : service.type === 'prawo' ? 'slate' : 'blue'}-200`}>
                              {service.type}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 font-sans leading-tight">
                            powiat: <span className="font-bold text-slate-600">{service.powiat}</span> • 
                            gmina: <span className="font-bold text-slate-600">{service.gmina}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-105 flex items-center gap-1.5 text-[10.5px] text-[#0f1412] font-semibold break-all">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a 
                              href={`mailto:${service.email}`} 
                              onClick={(e) => e.stopPropagation()} 
                              className="hover:underline text-emerald-800"
                            >
                              {service.email}
                            </a>
                          </div>
                        </div>

                        <div className="mt-3 text-[9px] uppercase font-black tracking-widest text-slate-400 flex justify-between items-center w-full">
                          <span>Woj. {service.wojewodztwo}</span>
                          <span className={`${isSelected ? 'text-black font-extrabold' : ''}`}>
                            {isSelected ? 'Wybrano placówkę' : 'Pokaż na mapie →'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {filteredServices.length > 100 && (
                    <p className="text-[10px] text-center text-slate-400 italic pt-2">
                      I więcej... Zawęź wyszukiwanie, aby precyzyjnie przeglądać listę.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Leaflet Map Container (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[28px] overflow-hidden flex flex-col relative min-h-[460px] lg:min-h-[580px] shadow-xs">
            <div className="absolute top-4 right-4 z-40 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 text-[#0f1412]">
              <Layers className="w-3.5 h-3.5" />
              <span>Podkład: CartoDB Positron</span>
            </div>

            <div className="flex-1 w-full h-full relative z-10">
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                className="w-full h-full"
                scrollWheelZoom={true}
              >
                {/* Dynamically align position */}
                <CenterMapHandler center={mapCenter} zoom={mapZoom} />

                {/* Standard CartoDB Positron elegant light map layer */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Render markers */}
                {filteredServices.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <Marker
                      key={service.id}
                      position={[service.lat, service.lng]}
                      icon={createCustomMarkerIcon(service.type, isSelected)}
                      eventHandlers={{
                        click: () => {
                          setSelectedService(service);
                        }
                      }}
                    >
                      <Popup maxWidth={300} className="custom-leaflet-popup">
                        <div className="font-sans text-xs space-y-2 p-1 text-left">
                          <div className="flex justify-between items-start gap-1 pb-1 border-b border-slate-200">
                            <h3 className="font-serif font-black text-sm text-[#0f1412] heading-tight">
                              {service.cityLabel}
                            </h3>
                            <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                              {service.type}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-tight">
                            <b>Województwo:</b> {service.wojewodztwo}<br />
                            <b>Powiat:</b> {service.powiat}<br />
                            <b>Gmina:</b> {service.gmina}
                          </p>

                          <div className="bg-[#FAF8F4] p-2 rounded-lg border border-slate-150 space-y-1">
                            <span className="text-[8.5px] uppercase font-black text-slate-400 block tracking-wider">
                              Bezpośredni kontakt email:
                            </span>
                            <div className="flex items-center gap-1.5 break-all">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a 
                                href={`mailto:${service.email}`} 
                                className="font-extrabold text-[#0f1412] hover:underline"
                              >
                                {service.email}
                              </a>
                            </div>
                          </div>

                          <div className="pt-1 flex justify-between items-center text-[9px] uppercase font-black text-slate-400">
                            <span>Szybka pomoc</span>
                            <a 
                              href={`mailto:${service.email}?subject=Zapytanie ze strony mostpomocy.pl`} 
                              className="text-emerald-800 hover:underline"
                            >
                              Napisz maila →
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Render user location if gathered */}
                {userLocation && (
                  <Marker position={userLocation} icon={createUserIcon()}>
                    <Popup>
                      <div className="font-sans text-xs p-1 text-left">
                        <h4 className="font-bold text-[#0f1412] mb-0.5">Twoja lokalizacja</h4>
                        <p className="text-[11px] text-slate-600 mb-0">
                          Centrum mapy zostało przeniesione do Twojego położenia GPS.
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            {/* Bottom active block with details */}
            {selectedService && (
              <div className="bg-slate-950 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800 animate-slide-in relative z-20 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C97A63]">
                      Wybrany punkt wsparcia
                    </span>
                    <span className="text-[9px] bg-slate-8次 bg-white/10 px-1.5 py-0.5 rounded text-slate-200">
                      {selectedService.type}
                    </span>
                  </div>
                  <h4 className="text-base font-serif font-black">
                    {selectedService.cityLabel}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Gmina {selectedService.gmina}, powiat {selectedService.powiat}, woj. {selectedService.wojewodztwo}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <a 
                    href={`mailto:${selectedService.email}`}
                    className="flex-1 sm:flex-initial text-center bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                  >
                    Napisz bezpośrednią wiadomość (Email)
                  </a>
                  <button 
                    onClick={() => {
                      setMapCenter([52.0693, 19.4803]);
                      setMapZoom(6);
                      setSelectedService(null);
                    }}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-xl"
                    title="Zamknij podgląd"
                  >
                    <span className="text-white text-xs font-bold block leading-none">×</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend Panel */}
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 text-left">
          <h3 className="text-sm font-serif font-black text-[#0f1412] mb-3">Legenda symboli wsparcia:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(MARKER_COLORS).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-2 border border-slate-100 rounded-xl bg-[#FAF8F4]">
                <span className={`w-3.5 h-3.5 rounded-full ${value.bg}`} />
                <div className="text-left leading-none">
                  <span className="text-xs font-black text-slate-900 block">{value.label}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{key}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
