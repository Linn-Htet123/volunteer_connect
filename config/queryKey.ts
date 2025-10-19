export const KEYS = {
  events: {
    all: "events",
    detail: (id: number | string) => `event-${id}`,
    my_events: "my-events",
    tasksForVolunteerInEvent: (ids: { volunteerId: number; eventId: number }) =>
      `tasks-event-${ids.volunteerId}-${ids.eventId}`,
    org_all: "org-all",
    volunteers: "volunteers",
    event_volunteers: (eventId: number) => `event-volunteers-${eventId}`,
  },
  auth: {
    me: "auth-me",
  },
  chat: {
    messages: (eventId: number) => `messages-event-${eventId}`,
  },
  tasks: {
    volunteers: (taskId: number) => `task-volunteers-${taskId}`,
    all: "task-all",
    detail: (taskId: number) => `task-${taskId}`,
  },
} as const;
