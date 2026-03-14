import api from "../util/api";

export const addCategory = async (category) => {
  return await api.post("/admin/categories", category);
};

export const deleteCategory = async (categoryId) => {
  return await api.delete(`/admin/categories/${categoryId}`);
};

export const fetchCategory = async () => {
  return await api.get("/categories");
};
