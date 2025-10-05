import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus(import.meta.env.VITE_SERVER_URL).with(rest());

export default directus;

// The Directus client is modular. By default, it does nothing. So must be explicitly added capabilities like:

// rest() → to interact with items (collections)

// auth() → for login/session handling

// realtime() → for websockets