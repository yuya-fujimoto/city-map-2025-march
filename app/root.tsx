import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import { useEffect } from 'react';

import appStylesHref from './app.css?url';

import { getCities } from './data';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: appStylesHref }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const cities = await getCities(q);
  return json({ cities, q });
};

export default function App() {
  const { cities, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    const searchField = document.getElementById('q');
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || '';
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Build Project Cities</h1>
          <div>
            <Form
              id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search"
            >
              <input
                id="q"
                aria-label="Search contacts"
                className={searching ? 'loading' : ''}
                defaultValue={q || ''}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {cities.length ? (
              <ul>
                {cities.map((city) => (
                  <li key={city.id}>
                    <NavLink
                      className={({ isActive, isPending }) => (isActive ? 'active' : isPending ? 'pending' : '')}
                      to={`cities/${city.id}`}
                    >
                      {city.name ? <>{city.name}</> : <i>No Name</i>}{' '}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No cities</i>
              </p>
            )}
          </nav>
        </div>
        <div id="detail" className={navigation.state === 'loading' && !searching ? 'loading' : ''}>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
