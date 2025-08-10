
import { google } from 'googleapis';

/**
 * Google OAuth2 client configuration.
 * Uses environment variables for client ID, secret, and redirect URI.
 */
const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Google Calendar API instance, pre-configured with OAuth2 client.
 */
export const calendar = google.calendar({ version: 'v3', auth });

/**
 * Sets the credentials for the Google OAuth2 client.
 * This is used to authorize API requests on behalf of the user.
 * @param {string} accessToken - The user's access token from Google.
 * @param {string} [refreshToken] - The user's refresh token (optional).
 */
export function setGoogleCredentials(accessToken: string, refreshToken?: string) {
    auth.setCredentials({ 
        access_token: accessToken,
        refresh_token: refreshToken
    });
}
