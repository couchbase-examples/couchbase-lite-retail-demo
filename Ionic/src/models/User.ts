export interface User {
  username: string;
  store: 'AA' | 'NYC';
  role: string;
}

export interface DemoUser {
  username: string;
  password: string;
  store: 'AA' | 'NYC';
  label: string;
  endpoint: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    username: 'aa-store-01@supermarket.com',
    password: 'P@ssword1',
    store: 'AA',
    label: 'Ann Arbor Store Manager',
    endpoint: 'supermarket-aa',
  },
  {
    username: 'nyc-store-01@supermarket.com',
    password: 'P@ssword1',
    store: 'NYC',
    label: 'NYC Store Manager',
    endpoint: 'supermarket-nyc',
  },
];
