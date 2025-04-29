import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { DataCard } from '~/components/data-card';
import MapComponent from '~/components/map';
import { getCity } from '~/data';

// what city it is
// we need to know the location (lat, long) of the city

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const cityId = params.cityId;
  if (!cityId) {
    throw new Error('City ID is required');
  }
  const city = await getCity(cityId);
  if (!city) {
    throw new Error('City not found');
  }
  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!mapboxAccessToken) {
    throw new Error('Mapbox access token is required');
  }
  return json({ city, mapboxAccessToken });
};

export default function City() {
  const { city, mapboxAccessToken } = useLoaderData<typeof loader>();

  return (
    <div
      id="contact"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        display: 'block',
      }}
    >
      <DataCard title={city.dataTitle} description={city.dataDescription} dataSourceUrl={city.dataSourceUrl} />
      <MapComponent city={city} mapboxAccessToken={mapboxAccessToken} />
    </div>
  );
}
