import { Map as MapGL } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoieXV5YWZ1amltb3RvIiwiYSI6ImNsbm5wNXVwMzA3Y3Iya3Ftd2c1MW92djkifQ.gJHn2MuzuWqhlTnVg018Eg';

type City = {
  id: string;
  name: string;
  location: {
    lat: number;
    long: number;
  };
};
interface MapComponentProps {
  initialZoom?: number;
  mapStyle?: string;
  city: City;
}

export default function MapComponent({
  initialZoom = 12,
  mapStyle = 'mapbox://styles/mapbox/streets-v11',
  city,
}: MapComponentProps) {
  const [viewState, setViewState] = useState({
    longitude: city.location.long,
    latitude: city.location.lat,
    zoom: initialZoom,
  });

  useEffect(() => {
    setViewState({
      longitude: city.location.long,
      latitude: city.location.lat,
      zoom: initialZoom,
    });
  }, [city, initialZoom]);

  return (
    <MapGL
      {...viewState}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle={mapStyle}
      onMove={(e) => setViewState(e.viewState)}
    />
  );
}
