import api from "../util/api";

export const login = async (data) => {
    return await api.post("/login", data);
}