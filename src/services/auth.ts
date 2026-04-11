import { api } from "./api";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return data;
};