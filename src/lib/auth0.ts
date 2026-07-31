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
 * Auth0 App Router client — Google via Auth0 social connection.
 * Configure the Google connection in the Auth0 dashboard; we request it explicitly.
 */
export const auth0 = auth0Configured
  ? new Auth0Client({
      authorizationParameters: {
        connection: "google-oauth2",
      },
    })
  : null;
