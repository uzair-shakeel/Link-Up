import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://link-up-api.vercel.app/api/",
  withCredentials: true,
  timeout: 600000,
});

// export const makeRequest = axios.create({
//   baseURL: "http://localhost:8800/api/",
//   withCredentials: true,
//   timeout: 600000,
// });

// export const BASE_URL = "http://localhost:8800/api";
export const BASE_URL = "https://link-up-api.vercel.app/api";
