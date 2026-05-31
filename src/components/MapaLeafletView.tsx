import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, MapPin, Mail, Navigation, Info, 
  Layers, Map, Heart, AlertCircle, Shield, Scale, 
  HelpCircle, CheckCircle2, ChevronRight, Compass, Sparkles, ExternalLink
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

// Calculate geodesic distance to find closest database matches dynamically
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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

// Brand Colors
const MARKER_COLORS = {
  kryzys: { hex: '#C97A63', bg: 'bg-[#C97A63]', border: 'border-[#AB614C]', text: 'text-[#C97A63]', label: 'Kryzys i Interwencja', desc: 'Przemoc, niebezpieczeństwo domowe, Niebieska Karta' },
  prawo: { hex: '#4A5D4E', bg: 'bg-[#4A5D4E]', border: 'border-[#3D4C40]', text: 'text-[#4A5D4E]', label: 'Prawo i Świadczenia', desc: 'Porady prawne, odwołania od decyzji, alimenty' },
  zdrowie: { hex: '#3B82F6', bg: 'bg-[#3B82F6]', border: 'border-[#1D4ED8]', text: 'text-[#3B82F6]', label: 'Zdrowie i Psychika', desc: 'Onkologia, depresja, wsparcie psychiczne' },
  bytowe: { hex: '#D97706', bg: 'bg-[#D97706]', border: 'border-[#B45309]', text: 'text-[#D97706]', label: 'Zasiłki i Byt', desc: 'Schronienie, środki finansowe, zasiłki celowe MOPS' }
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
    map.setView(center, zoom, { animate: true, duration: 1.2 });
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

  // Geo-position state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [localizedCityMsg, setLocalizedCityMsg] = useState<string | null>(null);

  // Fast Mini-survey State for instant need diagnostics
  const [surveyStep, setSurveyStep] = useState<number>(0); // 0: closed/start, 1: Q1, 2: Q2 (result applied)
  const [surveyAnswers, setSurveyAnswers] = useState({
    mainNeed: '',
    severity: ''
  });

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

  // Filter list of voivodeships for dropdowns
  const voivodeships = useMemo(() => {
    const set = new Set<string>();
    transformedServices.forEach(s => set.add(s.wojewodztwo));
    return Array.from(set).sort();
  }, [transformedServices]);

  // Handle live query output
  const filteredServices = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return transformedServices.filter((service) => {
      const matchesType = selectedType === 'all' || service.type === selectedType;
      const matchesVoivodeship = selectedVoivodeship === 'all' || service.wojewodztwo === selectedVoivodeship;
      
      const matchesQuery = query === '' ||
        service.cityLabel.toLowerCase().includes(query) ||
        service.wojewodztwo.toLowerCase().includes(query) ||
        service.powiat.toLowerCase().includes(query) ||
        service.gmina.toLowerCase().includes(query) ||
        service.email.toLowerCase().includes(query);

      return matchesType && matchesVoivodeship && matchesQuery;
    });
  }, [transformedServices, selectedType, selectedVoivodeship, searchQuery]);

  // Is the search state "active" (meaning user either searched, selected a category, or localized)?
  const isFilterActive = useMemo(() => {
    return searchQuery.trim() !== '' || selectedType !== 'all' || selectedVoivodeship !== 'all' || userLocation !== null;
  }, [searchQuery, selectedType, selectedVoivodeship, userLocation]);

  // Request browser GPS position and automatically set nearest city!
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError('Twoja przeglądarka nie wspiera geolokalizacji.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocalizedCityMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        // Find nearest city in database
        let nearestService: UnifiedService | null = null;
        let minDistance = Infinity;

        transformedServices.forEach((service) => {
          const dist = calculateDistance(latitude, longitude, service.lat, service.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestService = service;
          }
        });

        if (nearestService) {
          const matchedCity = (nearestService as UnifiedService).cityLabel;
          setSearchQuery(matchedCity);
          setMapCenter([(nearestService as UnifiedService).lat, (nearestService as UnifiedService).lng]);
          setMapZoom(12);
          setLocalizedCityMsg(`Wykryliśmy najbliższą miejscowość: ${matchedCity} (~${minDistance.toFixed(1)} km)`);
        } else {
          setMapCenter([latitude, longitude]);
          setMapZoom(11);
        }
        
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setLocationError('Nie udało się uzyskać lokalizacji. Wpisz ręcznie miasto w okienko poniżej.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const selectFacility = (service: UnifiedService) => {
    setSelectedService(service);
    setMapCenter([service.lat, service.lng]);
    setMapZoom(13);
  };

  // Safe Google search query generator instead of broken static opening hours
  const getGoogleSearchUrl = (facility: UnifiedService) => {
    const term = `${facility.typeLabel} ${facility.cityLabel} mops pcpr kontakt telefon`;
    return `https://www.google.com/search?q=${encodeURIComponent(term)}`;
  };

  // Diagnostic mini-survey click handler
  const handleSurveyOption = (field: 'mainNeed' | 'severity', value: string) => {
    const updated = { ...surveyAnswers, [field]: value };
    setSurveyAnswers(updated);

    if (field === 'mainNeed') {
      setSurveyStep(2);
    } else {
      // Apply results
      setSelectedType(updated.mainNeed);
      setSurveyStep(3); // Result tab
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1a211e] font-sans antialiased space-y-8">
      
      {/* 1. SECTOR: SZYBKIE DIAGNOZOWANIE (Survey & Category buttons first) */}
      <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 space-y-6 text-left shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-serif font-black tracking-tight text-[#0f1412]">
              Krok 1: Określ swój problem i cel
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Zaznacz odpowiedni przycisk, aby natychmiast ukryć niepotrzebne sprawy i skupić się wyłącznie na tym, co dla Ciebie w tej chwili najważniejsze.
            </p>
          </div>

          <button
            onClick={() => {
              setSurveyStep(surveyStep === 0 ? 1 : 0);
              setSurveyAnswers({ mainNeed: '', severity: '' });
            }}
            className="px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all border-2 border-[#DFCBB1] bg-[#FFFDF9] text-[#78350F] hover:bg-[#FDF6E2] flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-4.5 h-4.5 text-amber-600" />
            {surveyStep > 0 ? "Zamknij Szybki Test" : "Chętnie wypełnię Szybki Test Potrzeb"}
          </button>
        </div>

        {/* Diagnostic mini survey banner */}
        {surveyStep > 0 && surveyStep < 3 && (
          <div className="bg-[#FAF8F4] border border-slate-250 p-5 rounded-[20px] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
            
            {surveyStep === 1 && (
              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Pytanie 1 z 2</span>
                <h3 className="font-serif font-black text-sm text-black">Z czym mierzysz się dzisiaj w swoim życiu?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button 
                    onClick={() => handleSurveyOption('mainNeed', 'kryzys')}
                    className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left transition-colors"
                  >
                    🚨 Boję się bezpiecznikowo o życie w moim domu / Przemoc
                  </button>
                  <button 
                    onClick={() => handleSurveyOption('mainNeed', 'prawo')}
                    className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left transition-colors"
                  >
                    ⚖️ Potrzebuję asysty prawnej lub alimentów
                  </button>
                  <button 
                    onClick={() => handleSurveyOption('mainNeed', 'zdrowie')}
                    className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left transition-colors"
                  >
                    🩺 Choruję przewlekle, onkologicznie, mam depresję
                  </button>
                  <button 
                    onClick={() => handleSurveyOption('mainNeed', 'bytowe')}
                    className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left transition-colors"
                  >
                    🍞 Nie starcza mi na jedzenie, czynsz lub opłaty
                  </button>
                </div>
              </div>
            )}

            {surveyStep === 2 && (
              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Pytanie 2 z 2</span>
                <h3 className="font-serif font-black text-sm text-black">Jak pilnie potrzebujesz tego wsparcia medycznego lub urzędowego?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleSurveyOption('severity', 'natychmiast')}
                    className="p-3.5 bg-white hover:bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-left text-red-900 transition-colors"
                  >
                    🔴 Krytycznie pilne (Zasiłek nagły, ochrona prawna na już)
                  </button>
                  <button 
                    onClick={() => handleSurveyOption('severity', 'planowana')}
                    className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left transition-colors"
                  >
                    🟡 Standardowo (Weryfikacja praw i procedur)
                  </button>
                  <button 
                    onClick={() => handleSurveyOption('severity', 'informacja')}
                    className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left transition-colors"
                  >
                    🟢 Edukacyjnie/Poradnikowo (Szukam wiedzy ogólnej na przyszłość)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Real-time survey diagnostic feedback */}
        {surveyStep === 3 && (
          <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] font-black text-emerald-800 uppercase block tracking-wider">Test Potrzeb Zakończony</span>
                <p className="text-xs text-slate-700 leading-normal">
                  Zdefiniowaliśmy Twoje główne zapotrzebowanie. **Mapa poniżej została już automatycznie przefiltrowana.**
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedType('all');
                setSurveyStep(0);
              }}
              className="text-[10px] underline font-black uppercase text-emerald-900 tracking-wider hover:text-black shrink-0 font-mono"
            >
              Resetuj wyniki testu ×
            </button>
          </div>
        )}

        {/* 4 Large Responsive Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {Object.entries(MARKER_COLORS).map(([key, value]) => {
            const isChosen = selectedType === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedType(isChosen ? 'all' : key)}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[140px] ${
                  isChosen 
                    ? 'bg-slate-900 border-black text-white shadow-md scale-102 ring-2 ring-black/10' 
                    : 'bg-white border-slate-150 hover:border-slate-350 hover:shadow-xs text-slate-900'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`w-3.5 h-3.5 rounded-full ${value.bg}`} />
                    {isChosen && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <h3 className="font-serif font-black text-sm leading-tight">
                    {value.label}
                  </h3>
                  <p className={`text-[11px] leading-normal mt-1.5 ${isChosen ? 'text-slate-300' : 'text-slate-500'}`}>
                    {value.desc}
                  </p>
                </div>

                <div className={`text-[9.5px] uppercase font-black tracking-widest mt-4 pt-2.5 border-t ${isChosen ? 'border-slate-800 text-amber-300' : 'border-slate-100 text-[#0f1412]'}`}>
                  {isChosen ? 'Wybrane i Aktywne' : 'Filtruj tę grupę →'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECTOR: INTEGRATED MAP & EASY FILTER SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COMPACT MAP SEARCH PANEL (5 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-[24px] p-5 space-y-4 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Krok 2: Znajdź najbliższy punkt
            </h3>

            <div className="space-y-3">
              {/* Georeferencing GPS trigger with auto-population of city */}
              <div>
                <button
                  type="button"
                  onClick={handleLocateUser}
                  disabled={isLocating}
                  className="w-full bg-[#0f1412] hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.1em] py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className={`w-4 h-4 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Pobieranie pozycji GPS...' : '📍 Pobierz moją lokalizację (GPS)'}
                </button>
                
                {localizedCityMsg && (
                  <p className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-150 p-2 rounded-lg mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {localizedCityMsg}
                  </p>
                )}

                {locationError && (
                  <p className="text-[10.5px] text-red-800 font-semibold bg-red-50 border border-red-150 p-2 rounded-lg mt-2">
                    {locationError}
                  </p>
                )}
              </div>

              {/* Instant Search Bar */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Wpisz nazwę swojej miejscowości
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Wpisz np. Sosnowiec, Katowice, Zabrze..."
                    className="w-full bg-[#FAF8F4] pl-9 pr-12 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-black focus:outline-none focus:border-black transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setLocalizedCityMsg(null);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-black uppercase text-slate-400 hover:text-black focus:outline-none"
                    >
                      Wyczyść
                    </button>
                  )}
                </div>
              </div>

              {/* Voivodeship selection as simple dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ...lub wybierz województwo
                </label>
                <select
                  value={selectedVoivodeship}
                  onChange={(e) => setSelectedVoivodeship(e.target.value)}
                  className="w-full bg-[#FAF8F4] p-3 rounded-xl border border-slate-200 text-xs font-semibold text-black focus:outline-none focus:border-black min-h-[38px]"
                >
                  <option value="all">🗺️ Pokazuj placówki z całej Polski</option>
                  {voivodeships.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DYNAMIC SCROLL FEED (No unfiltered clutter unless parameters set) */}
          <div className="flex-grow bg-white border border-slate-200 rounded-[24px] p-5 flex flex-col min-h-[300px] text-left">
            {!isFilterActive ? (
              // Welcome prompt instead of full list on launch to keep it clear and calm
              <div className="my-auto py-12 text-center space-y-4 px-2">
                <div className="w-14 h-14 rounded-full bg-[#FFFDF9] border border-amber-200 flex items-center justify-center mx-auto text-xl filter drop-shadow-xs">
                  🕊️
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-black text-[#0f1412] text-sm">Witaj w strefie bezpiecznego wyszukania</h3>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Aby unikać natłoku informacji, ukryliśmy całą ogólnopolską listę. 
                    **Wybierz kategorię u góry lub kliknij przycisk GPS / wpisz miasto**, aby natychmiast zobaczyć najbliższe punkty ratunkowe.
                  </p>
                </div>
                
                {/* Popular local fast buttons */}
                <div className="pt-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Wyszukaj szybko:</span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {['Sosnowiec', 'Katowice', 'Dąbrowa Górnicza', 'Gliwice', 'Bytom'].map((popCity) => (
                      <button
                        key={popCity}
                        onClick={() => setSearchQuery(popCity)}
                        className="px-2.5 py-1 bg-[#FAF8F4] hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-800"
                      >
                        {popCity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // ActiveFiltered results are shown
              <div className="flex flex-col h-full space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Sugerowane placówki ({filteredServices.length})
                  </span>
                  
                  {isFilterActive && (
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedType('all');
                        setSelectedVoivodeship('all');
                        setUserLocation(null);
                        setLocalizedCityMsg(null);
                        setSurveyStep(0);
                      }}
                      className="text-[9px] font-black text-rose-700 uppercase hover:underline"
                    >
                      Wyczyść filtry ×
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto no-scrollbar max-h-[300px] lg:max-h-[360px] space-y-2.5 flex-1 pr-1">
                  {filteredServices.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <span className="text-2xl filter drop-shadow-xs">📡</span>
                      <h4 className="font-serif font-black text-xs">Brak bezpośrednich rekordów</h4>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-normal">
                        Dla tej miejscowości nie mamy jeszcze unikalnego adresu e-mail. 
                        Wpisz większe miasto powiatowe obok Ciebie lub wyszukaj bezpośrednio w Google.
                      </p>
                    </div>
                  ) : (
                    filteredServices.slice(0, 50).map((service) => {
                      const isSelected = selectedService?.id === service.id;
                      const config = MARKER_COLORS[service.type];
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => selectFacility(service)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                            isSelected 
                              ? 'bg-[#FBF9F4] border-black ring-1 ring-black/5 shadow-xs' 
                              : 'bg-white border-slate-100 hover:border-slate-350'
                          }`}
                        >
                          <div className="space-y-1.5 w-full">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-serif font-black text-xs text-[#0f1412] leading-tight truncate">
                                {service.cityLabel}
                              </h4>
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${config.text} ${config.bg}/5 border-slate-200`}>
                                {service.type}
                              </span>
                            </div>

                            <div className="text-[10.5px] text-slate-500 leading-tight">
                              gmina: <span className="font-semibold text-slate-700">{service.gmina}</span>, powiat: <span className="font-semibold text-slate-700">{service.powiat}</span>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10.5px] text-emerald-850 font-bold max-w-full truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{service.email}</span>
                            </div>
                          </div>

                          <div className="mt-3 text-[9px] uppercase font-black tracking-widest text-slate-400 flex justify-between items-center w-full">
                            <span>Woj. {service.wojewodztwo}</span>
                            <span className={`${isSelected ? 'text-black font-extrabold' : ''}`}>
                              {isSelected ? 'Wybrana' : 'Pokaż na mapie →'}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Leaflet Map Panel (7 columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[28px] overflow-hidden flex flex-col relative min-h-[460px] lg:min-h-[580px] shadow-xs">
          
          {/* Tile Layer Overlay */}
          <div className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1.5 text-[#0f1412] shadow-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>Map: CartoDB Positron</span>
          </div>

          {/* Leaflet Frame */}
          <div className="flex-1 w-full h-full relative z-10">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              className="w-full h-full"
              scrollWheelZoom={true}
            >
              {/* Dynamic Center Handler */}
              <CenterMapHandler center={mapCenter} zoom={mapZoom} />

              {/* Crisp Clean Light layout that keeps icons readable without color clutter */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              {/* Render Leaflet markers */}
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
                          <h3 className="font-serif font-black text-sm text-[#0f1412] leading-tight">
                            {service.cityLabel}
                          </h3>
                          <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                            {service.type}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-tight">
                          <b>Gmina:</b> {service.gmina} • <b>Powiat:</b> {service.powiat}<br />
                          <b>Województwo:</b> {service.wojewodztwo}
                        </p>

                        <div className="bg-[#FAF8F4] p-2.5 rounded-lg border border-slate-150 space-y-1.5">
                          <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider leading-none">
                            Zweryfikowany Kontakt email:
                          </span>
                          <div className="flex items-center gap-1.5 break-all">
                            <span className="font-extrabold text-blue-900">
                              {service.email}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons list directly inpopup */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                          <a 
                            href={`mailto:${service.email}?subject=Zapytanie ze strony mostpomocy.pl`} 
                            className="w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black uppercase py-2 rounded-lg transition-colors"
                          >
                            ✉️ Wyślij zapytanie E-mail
                          </a>
                          
                          {/* GOOGLE SEARCH ACTION pointing out exact regional hours */}
                          <a 
                            href={getGoogleSearchUrl(service)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-black uppercase py-2 rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1"
                          >
                            <Search className="w-3 h-3 text-slate-500" />
                            Szukaj danych w Google
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Render detected user location */}
              {userLocation && (
                <Marker position={userLocation} icon={createUserIcon()}>
                  <Popup>
                    <div className="font-sans text-xs p-1 text-left">
                      <h4 className="font-bold text-[#0f1412] mb-0.5">Twoja lokalizacja</h4>
                      <p className="text-[11px] text-slate-600 mb-0">
                        Zlokalizowano na mapie. Wyświetlamy najbliższe placówki.
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Bottom active block with beautiful highlights */}
          {selectedService && (
            <div className="bg-slate-950 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800 animate-slide-in relative z-20 text-left">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#C97A63] bg-white/10 px-2 py-0.5 rounded">
                  {selectedService.typeLabel} ({selectedService.type})
                </span>
                <h4 className="text-lg font-serif font-black text-white leading-tight">
                  {selectedService.cityLabel}
                </h4>
                <p className="text-xs text-slate-400">
                  Gmina {selectedService.gmina}, powiat {selectedService.powiat}, woj. {selectedService.wojewodztwo}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
                <a 
                  href={`mailto:${selectedService.email}`}
                  className="bg-white text-black hover:bg-slate-200 text-[10px] font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all text-center"
                >
                  Napisz E-mail do placówki
                </a>
                
                {/* Dynamically search in Google for verified hours/telephone */}
                <a 
                  href={getGoogleSearchUrl(selectedService)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 text-white hover:bg-slate-750 text-[10px] font-black uppercase tracking-wider px-4 py-3 rounded-xl transition-all border border-slate-700 text-center flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Wyszukaj w Google
                </a>

                <button 
                  onClick={() => setSelectedService(null)}
                  className="text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1 whitespace-nowrap self-center hidden sm:block"
                >
                  Zamknij ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simplified, editorial Legend Panel */}
      <div className="bg-white border border-slate-200 rounded-[24px] p-6 text-left">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#0f1412] mb-3">Legenda Placówek Wspomagających:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(MARKER_COLORS).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-[#FAF8F4]">
              <span className={`w-3 h-3 rounded-full shrink-0 ${value.bg}`} />
              <div className="text-left leading-none space-y-0.5">
                <span className="text-xs font-black text-slate-900 block">{value.label}</span>
                <span className="text-[10px] text-slate-400 capitalize">{key}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
