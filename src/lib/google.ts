import { google } from 'googleapis';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const calendar = google.calendar({ version: 'v3', auth });

export function setGoogleCredentials(accessToken: string, refreshToken?: string) {
    auth.setCredentials({ 
        access_token: accessToken,
        refresh_token: refreshToken
    });
}
