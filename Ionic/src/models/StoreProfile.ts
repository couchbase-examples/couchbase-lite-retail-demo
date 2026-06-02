/**
 * Store profile document — matches the seeded Capella schema and the Android /
 * Java ports. The address fields live in a nested `location` dict; contact in
 * a nested `contact` dict; `manager` is *usually* a nested object
 * `{ name, email, employeeId }` but legacy docs have it as a plain string —
 * we normalize to a string display name (`manager.name`) below.
 */
export interface StoreProfile {
  id: string;
  docType: 'StoreProfile';
  storeId: string;
  name: string;
  contact?: {
    email: string;
    phone: string;
  };
  location?: {
    address1: string;
    address2?: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    coordinates?: { lat: number; lon: number };
  };
  manager?: string;
  openingHours?: string;
}

export function storeProfileFromDoc(id: string, doc: Record<string, unknown>): StoreProfile {
  const contact = doc.contact as StoreProfile['contact'];
  const location = doc.location as StoreProfile['location'];
  // The Capella docs ship `manager` as { name, email, employeeId } — but
  // earlier seed datasets had it as a plain string. Accept either, always
  // return a string for the UI.
  let manager: string | undefined;
  const raw = doc.manager;
  if (typeof raw === 'string') {
    manager = raw;
  } else if (raw && typeof raw === 'object') {
    manager = (raw as { name?: string }).name;
  }
  return {
    id,
    docType: 'StoreProfile',
    storeId: (doc.storeId as string) ?? '',
    name: (doc.name as string) ?? '',
    contact,
    location,
    manager,
    openingHours: doc.openingHours as string | undefined,
  };
}
