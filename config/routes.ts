export const ROUTES = {
  HOME: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  CAMPAIGN: "/campaign",
  ORG_CAMPAIGN: "/org-campaign",
  CAMPAIGN_DETAILS: (id: number) => `/campaign/${id}`,
  MY_CAMPAIGN: "/my-campaigns",
  ORG_MY_CAMPAIGN: "/org-my-campaigns",
  MY_CAMPAIGN_DETAIL: (camId: number) => ` /my-campaigns/${camId}`,
  ORG_MY_CAMPAIGN_DETAIL: (camId: number) => `/org-my-campaigns/${camId}`,
  EDIT_CAMPAIGN: (eventId: number) => `/campaign/${eventId}/edit`,
  TASK_ASSIGNMENT: (taskId: number, eventId: number) =>
    `/task-assignment/${taskId}/${eventId}`,
  ORG_CREATE_CAMPAIGN: "/org-campaign/create",
};
