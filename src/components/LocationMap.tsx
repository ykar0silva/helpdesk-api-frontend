import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CORREÇÃO DE ÍCONES DO LEAFLET (Para o pino não sumir) ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Posição Padrão (Palmas - TO)
const defaultCenter = { lat: -10.1835695, lng: -48.3338573 };

// Componente para atualizar o centro do mapa quando o GPS mudar
function MapController({ center }: { center: { lat: number, lng: number } }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 15);
        }
    }, [center, map]);
    return null;
}

// Componente para capturar o clique no mapa
function LocationMarker({ position, onSelect }: { position: { lat: number, lng: number }, onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return position ? <Marker position={position} /> : null;
}

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export function LocationMap({ onLocationSelect }: LocationMapProps) {
    const [position, setPosition] = useState(defaultCenter);

    useEffect(() => {
        // Tenta pegar o GPS uma vez ao carregar
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setPosition(newPos);
                    onLocationSelect(newPos.lat, newPos.lng);
                },
                (err) => {
                    console.warn("GPS indisponível, usando padrão.", err);
                },
                { timeout: 5000 }
            );
        }
    }, []); // Array vazio para rodar apenas na montagem

    return (
        // z-0 e isolate garantem que o mapa não fique por cima de outros elementos
        <div className="w-full h-full z-0 isolate relative">
            <MapContainer 
                center={defaultCenter} 
                zoom={15} 
                style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />
                
                {/* Controladores */}
                <MapController center={position} />
                <LocationMarker 
                    position={position} 
                    onSelect={(lat, lng) => {
                        setPosition({ lat, lng });
                        onLocationSelect(lat, lng);
                    }} 
                />
            </MapContainer>
        </div>
    );
}