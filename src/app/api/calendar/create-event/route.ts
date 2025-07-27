import { NextResponse } from 'next/server';
import { calendar, setGoogleCredentials } from '@/lib/google';

export async function POST(request: Request) {
  // NOTE: This is a simplified example. In a real application,
  // you would get the user's access token from your database/session.
  // For this example, you would need to implement the full OAuth2 flow
  // to get an access token.
  const { accessToken, appointment } = await request.json();

  if (!accessToken || !appointment) {
    return NextResponse.json({ error: 'Missing access token or appointment data' }, { status: 400 });
  }

  try {
    setGoogleCredentials(accessToken);

    const event = {
      summary: appointment.title,
      location: appointment.location,
      description: `Appointment with ${appointment.doctor}.`,
      start: {
        dateTime: new Date(appointment.date + 'T' + appointment.time).toISOString(),
        timeZone: 'America/Los_Angeles', // This should be dynamic based on user's timezone
      },
      end: {
        dateTime: new Date(new Date(appointment.date + 'T' + appointment.time).getTime() + 60 * 60 * 1000).toISOString(), // Assuming 1 hour duration
        timeZone: 'America/Los_Angeles',
      },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return NextResponse.json({ message: 'Event created successfully', event: createdEvent.data });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}
