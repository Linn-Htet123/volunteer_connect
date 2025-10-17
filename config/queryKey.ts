export const KEYS = {
  events: {
    all: "events",
    detail: (id: number | string) => `event-${id}`,
    my_events: "my-events",
    tasksForVolunteerInEvent: (ids: { volunteerId: number; eventId: number }) =>
      `tasks-event-${ids.volunteerId}-${ids.eventId}`,
  },
  auth: {
    me: "auth-me",
  },
  chat: {
    messages: (eventId: number) => `messages-event-${eventId}`,
  },
} as const;
