"use server";
import axios, { AxiosInstance } from "axios";
import { backend } from "./constant";
import { cookies } from "next/headers";
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: backend,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((request) => {
  const cookieStore = cookies();
  const token = cookieStore.get("Authorization");
  request.headers.Authorization = `Bearer ${token?.value}`;
  return request;
});
