import api from "../util/api";

export const latestOrder = async () => {
  return await api.get("/orders/latest");
};

export const createOrder = async (order) => {
  return await api.post("/orders", order);
};

export const deleteOrder = async (orderId) => {
  return await api.delete(`/orders/${orderId}`);
};

export const fetchOrders = async () => {
  return await api.get("/orders/latest");
};
