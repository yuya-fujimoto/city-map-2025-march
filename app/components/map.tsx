import { Map as MapGL } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoieXV5YWZ1amltb3RvIiwiYSI6ImNsbm5wNXVwMzA3Y3Iya3Ftd2c1MW92djkifQ.gJHn2MuzuWqhlTnVg018Eg';

interface MapComponentProps {
  initialLongitude?: number;
  initialLatitude?: number;
  initialZoom?: number;
  mapStyle?: string;
}

export default function MapComponent({
  initialLongitude = -122.4,
  initialLatitude = 37.8,
  initialZoom = 12,
  mapStyle = 'mapbox://styles/mapbox/streets-v11',
}: MapComponentProps) {
  return (
    <MapGL
      initialViewState={{
        longitude: initialLongitude,
        latitude: initialLatitude,
        zoom: initialZoom,
      }}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle={mapStyle}
    />
  );
}
