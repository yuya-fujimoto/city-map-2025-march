////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
// @ts-expect-error - no types, but it's a tiny function
import sortBy from 'sort-by';
import invariant from 'tiny-invariant';

export type CityMutation = {
  id: string;
  name: string;
  dataUrl: string;
  location: {
    lat: number;
    long: number;
  };
  layer: 'HexagonLayer' | 'LineLayer';
  dataTitle: string;
  dataDescription: string;
  dataSourceUrl: string;
};

export type BikeRack = {
  ADDRESS: string;
  SPACES: number;
  COORDINATES: [longitude: number, latitude: number];
};

export type ContactRecord = CityMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeCities = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeCities.records)
      .map((key) => fakeCities.records[key])
      .sort(sortBy('-createdAt', 'last'));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeCities.records[id] || null;
  },

  async create(values: CityMutation): Promise<ContactRecord> {
    const createdAt = new Date().toISOString();
    const newContact = { createdAt, ...values };
    fakeCities.records[values.id] = newContact;
    return newContact;
  },

  async set(id: string, values: CityMutation): Promise<ContactRecord> {
    const contact = await fakeCities.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeCities.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeCities.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getCities(query?: string | null) {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  let cities = await fakeCities.getAll();
  if (query) {
    cities = matchSorter(cities, query, {
      keys: ['name'],
    });
    return cities;
  }
  return cities.sort(sortBy('name', 'createdAt'));
}

export async function getCity(id: string) {
  return fakeCities.get(id);
}

export async function updateCity(id: string, updates: CityMutation) {
  const city = await fakeCities.get(id);
  if (!city) {
    throw new Error(`No city found for ${id}`);
  }
  await fakeCities.set(id, { ...city, ...updates });
  return city;
}

export async function deleteCity(id: string) {
  fakeCities.destroy(id);
}

[
  {
    id: '1',
    name: 'New York',
    dataUrl: 'https://data.cityofnewyork.us/resource/uvpi-gqnh.json?$limit=5000&boroname=Manhattan',
    location: {
      lat: 40.7128,
      long: -74.006,
    },
    layer: 'HexagonLayer',
    dataTitle: '2015 Street Tree Census - Tree Data',
    dataDescription:
      'Street tree data from the TreesCount! 2015 Street Tree Census, conducted by volunteers and staff organized by NYC Parks & Recreation and partner organizations. Tree data collected includes tree species, diameter and perception of health. Accompanying blockface data is available indicating status of data collection and data release citywide.',
    dataSourceUrl: 'https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh/about_data',
  },
  {
    id: '2',
    name: 'Grand Rapids',
    dataUrl:
      'https://services2.arcgis.com/L81TiOwAPO1ZvU9b/arcgis/rest/services/Traffic_Crashes/FeatureServer/0/query?f=json&where=1%3D1&outFields=*&returnGeometry=false&resultRecordCount=5000',
    location: {
      lat: 42.9634,
      long: -85.6681,
    },
    layer: 'HexagonLayer',
    dataTitle: 'Traffic Crash Raw Data Set',
    dataDescription: 'GRAND RAPIDS POLICE DEPARTMENT',
    dataSourceUrl:
      'https://services2.arcgis.com/L81TiOwAPO1ZvU9b/arcgis/rest/services/Traffic_Crashes/FeatureServer/0/query?outFields=*&where=1%3D1&f=json',
  },
  {
    id: '3',
    name: 'Chicago',
    dataUrl: '',
    location: {
      lat: 41.8781,
      long: -87.6298,
    },
    layer: 'HexagonLayer',
    dataTitle: '2015 Street Tree Census - Tree Data',
    dataDescription:
      'Street tree data from the TreesCount! 2015 Street Tree Census, conducted by volunteers and staff organized by NYC Parks & Recreation and partner organizations. Tree data collected includes tree species, diameter and perception of health. Accompanying blockface data is available indicating status of data collection and data release citywide.',
    dataSourceUrl: 'https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh/about_data',
  },
  {
    id: '4',
    name: 'Houston',
    dataUrl: '',
    location: {
      lat: 29.7604,
      long: -95.3698,
    },
    layer: 'HexagonLayer',
    dataTitle: '2015 Street Tree Census - Tree Data',
    dataDescription:
      'Street tree data from the TreesCount! 2015 Street Tree Census, conducted by volunteers and staff organized by NYC Parks & Recreation and partner organizations. Tree data collected includes tree species, diameter and perception of health. Accompanying blockface data is available indicating status of data collection and data release citywide.',
    dataSourceUrl: 'https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh/about_data',
  },
  {
    id: '5',
    name: 'Miami',
    dataUrl: '',
    location: {
      lat: 25.7617,
      long: -80.1918,
    },
    layer: 'HexagonLayer',
    dataTitle: '2015 Street Tree Census - Tree Data',
    dataDescription:
      'Street tree data from the TreesCount! 2015 Street Tree Census, conducted by volunteers and staff organized by NYC Parks & Recreation and partner organizations. Tree data collected includes tree species, diameter and perception of health. Accompanying blockface data is available indicating status of data collection and data release citywide.',
    dataSourceUrl: 'https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh/about_data',
  },
  {
    id: '6',
    name: 'San Francisco',
    dataUrl: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
    location: {
      lat: 37.7749,
      long: -122.4194,
    },
    layer: 'HexagonLayer',
    dataTitle: '2015 Street Tree Census - Tree Data',
    dataDescription:
      'Street tree data from the TreesCount! 2015 Street Tree Census, conducted by volunteers and staff organized by NYC Parks & Recreation and partner organizations. Tree data collected includes tree species, diameter and perception of health. Accompanying blockface data is available indicating status of data collection and data release citywide.',
    dataSourceUrl: 'https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh/about_data',
  },
].forEach((city) => {
  fakeCities.create({
    ...city,
  });
});
