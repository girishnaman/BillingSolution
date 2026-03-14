import api from "../util/api";

export const fetchDashboardData = async () => {
  return await api.get("dashboard");
};
