import api from "../util/api";


export const addUser = async (user) => {
  return await api.post("/admin/register", user);
};

export const deleteUser = async (userId) => {
  return await api.delete(`/admin/users/${userId}`);
};

export const fetchUsers = async () => {
  return await api.get("/admin/users");
};