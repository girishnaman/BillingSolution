import api from "../util/api";

export const createRazorpayOrder = async (order) => {
  return await api.post("/payments/create-order", order);
};

export const verifyPayment = async (paymentDetails) => {
  return await api.post("/payments/verify", paymentDetails);
};
    