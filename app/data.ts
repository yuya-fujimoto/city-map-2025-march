////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
// @ts-expect-error - no types, but it's a tiny function
import sortBy from 'sort-by';
import invariant from 'tiny-invariant';

type CityMutation = {
  id: string;
  name: string;
  location: {
    lat: number;
    long: number;
  };
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
    location: {
      lat: 40.7128,
      long: -74.006,
    },
  },
  {
    id: '2',
    name: 'Los Angeles',
    location: {
      lat: 34.0522,
      long: -118.2437,
    },
  },
  {
    id: '3',
    name: 'Chicago',
    location: {
      lat: 41.8781,
      long: -87.6298,
    },
  },
  {
    id: '4',
    name: 'Houston',
    location: {
      lat: 29.7604,
      long: -95.3698,
    },
  },
  {
    id: '5',
    name: 'Miami',
    location: {
      lat: 25.7617,
      long: -80.1918,
    },
  },
  {
    id: '6',
    name: 'San Francisco',
    location: {
      lat: 37.7749,
      long: -122.4194,
    },
  },
].forEach((city) => {
  fakeCities.create({
    ...city,
  });
});
