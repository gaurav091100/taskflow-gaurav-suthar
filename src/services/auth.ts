import { api } from "./api";

export const login = async (email: string, password: string) => {
  const { data } = await api.get(`/users?email=${email}&password=${password}`);
  if (!data.length) throw new Error("Invalid credentials");

  return {
    token: "mock-token",
    user: data[0],
  };
};