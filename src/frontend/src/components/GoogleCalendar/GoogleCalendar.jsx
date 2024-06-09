import React, { useEffect } from "react";

export const GoogleCalendar = () => {
  const gapi = window.gapi;
  const google = window.google;

  const CLIENT_ID = "488476833453-72hhlp92tt0etkav7jaihofb2g4dgnii.apps.googleusercontent.com";
  const API_KEY = "AIzaSyB_hASYeGvCSbp7TgC-X1yvccpxW_Dglj4";
  const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  let gapiInited = false,
    gisInited = false,
    tokenClient;

  useEffect(() => {
    gapiLoaded();
    gisLoaded();
  }, []);

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;

    if (accessToken && expiresIn) {
      gapi.client.setToken({
        access_token: accessToken,
        expires_in: expiresIn,
      });
      listUpcomingEvents();
    }
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });

    gisInited = true;
  }

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        throw resp;
      }
      await listUpcomingEvents();
      const { access_token, expires_in } = gapi.client.getToken();
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
    };

    if (!(accessToken && expiresIn)) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      localStorage.clear();
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById("content").innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById("content").innerText = "No events found.";
      return;
    }
    // Flatten to string to display
    const output = events.reduce((str, event) =>
       `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
        "Events:\n"
  );
    document.getElementById("content").innerText = output;
  }

  function addManualEvent() {
    var event = {
      kind: "calendar#event",
      summary: "party meet",
      location: "Bangalore",
      description: "Party time",
      start: {
        dateTime: "2024-07-15T00:05:00.000Z",
        timeZone: "UTC",
      },
      end: {
        dateTime: "2024-07-15T01:35:00.000Z",
        timeZone: "UTC",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
      attendees: [
        { email: "pawarvaishnavi196@gmail.com", responseStatus: "needsAction" }
      ],
      reminders: {
        useDefault: true,
      },
      guestsCanSeeOtherGuests: true,
      conferenceData: {
        createRequest: {
          requestId: "some-random-string", // Ensure this is unique for each request
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };
  
    var request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1, // Include this parameter to use the conference data
      sendUpdates: "all",
    });
  
    request.execute(
      (event) => {
        console.log(event);
        window.open(event.htmlLink);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  

  return (
    <div>
      <button id="authorize_button" hidden={accessToken && expiresIn} onClick={handleAuthClick}>
        Authorize
      </button>
      <button id="signout_button" hidden={!accessToken && !expiresIn} onClick={handleSignoutClick}>
        Sign Out
      </button>
      <button id="add_manual_event" hidden={!accessToken && !expiresIn} onClick={addManualEvent}>
        Add Event
      </button>
      <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
    </div>
  );
};

export default GoogleCalendar;