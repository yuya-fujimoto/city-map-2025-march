import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import MapComponent from '~/components/map';
import { getCities, getCity } from '~/data';

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
  return json({ city });
};

export default function City() {
  const { city } = useLoaderData<typeof loader>();

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
      <MapComponent city={city} />
    </div>
  );
}
