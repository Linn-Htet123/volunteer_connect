export const ROUTES = {
  HOME: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  CAMPAIGN: "/campaign",
  CAMPAIGN_DETAILS: (id: number) => `/campaign/${id}`,
  MY_CAMPAIGN: "/my-campaigns",
  MY_CAMPAIGN_DETAIL: (camId: number) => ` /my-campaigns/${camId}`,
};
