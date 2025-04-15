import { Map as MapGL } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { HexagonLayer, HexagonLayerPickingInfo } from '@deck.gl/aggregation-layers';

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

type BikeRack = {
  ADDRESS: string;
  SPACES: number;
  COORDINATES: [longitude: number, latitude: number];
};

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

  const layers = [
    new HexagonLayer<BikeRack>({
      id: 'HexagonLayer',
      data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
      gpuAggregation: true,
      extruded: true,
      getPosition: (d: BikeRack) => d.COORDINATES,
      getColorWeight: (d: BikeRack) => d.SPACES,
      getElevationWeight: (d: BikeRack) => d.SPACES,
      elevationScale: 4,
      radius: 200,
      pickable: true,
    }),
  ];

  useEffect(() => {
    setViewState({
      longitude: city.location.long,
      latitude: city.location.lat,
      zoom: initialZoom,
    });
  }, [city, initialZoom]);

  return (
    <DeckGL layers={layers} initialViewState={viewState} controller={true}>
      <MapGL mapboxAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={mapStyle} onMove={(e) => setViewState(e.viewState)} />
    </DeckGL>
  );
}
