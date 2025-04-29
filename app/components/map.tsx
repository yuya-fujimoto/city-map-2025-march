import { Map as MapGL } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { CityMutation } from '~/data';
import { LineLayer } from 'deck.gl';

interface MapComponentProps {
  initialZoom?: number;
  mapStyle?: string;
  city: CityMutation;
  mapboxAccessToken: string;
}

type CityDataFromUrl = {
  ADDRESS: string;
  SPACES: number;
  COORDINATES: [longitude: number, latitude: number];
};

const Layers: Record<'HexagonLayer' | 'LineLayer', typeof HexagonLayer | typeof LineLayer> = {
  HexagonLayer: HexagonLayer,
  LineLayer: LineLayer,
};

type SupportedCityDataTypes = {
  '1': CityDataFromUrl;
};

const getPositionFunctionPicker = <T extends keyof SupportedCityDataTypes>(cityId: T) => {
  switch (cityId) {
    case '1':
      return (d: T) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return [parseFloat(d.longitude), parseFloat(d.latitude)];
      };
    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return (d: T) => d.COORDINATES;
  }
};

export default function MapComponent({
  initialZoom = 12,
  mapStyle = 'mapbox://styles/mapbox/streets-v11',
  city,
  mapboxAccessToken,
}: MapComponentProps) {
  const [viewState, setViewState] = useState({
    longitude: city.location.long,
    latitude: city.location.lat,
    zoom: initialZoom,
  });

  const SelectedLayer = Layers[city.layer];

  const layers = [
    new SelectedLayer<CityDataFromUrl>({
      id: city.layer,
      data: city.dataUrl,
      gpuAggregation: true,
      extruded: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      getPosition: getPositionFunctionPicker<CityDataFromUrl>(city.id),
      // getColorWeight: 1,
      // getElevationWeight: (d: CityDataFromUrl) => d.SPACES,
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
      <MapGL mapboxAccessToken={mapboxAccessToken} mapStyle={mapStyle} onMove={(e) => setViewState(e.viewState)} />
    </DeckGL>
  );
}
