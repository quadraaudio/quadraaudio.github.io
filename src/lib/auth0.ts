import { Auth0Client } from "@auth0/nextjs-auth0/server";

function hasAuth0Config() {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET
  );
}

export const auth0Configured = hasAuth0Config();

/**
 * Auth0 client for App Router. Requires AUTH0_* env vars at runtime for login.
 * Connection choice comes from Auth0 Universal Login / dashboard — not hardcoded here.
 */
export const auth0 = auth0Configured ? new Auth0Client() : null;
