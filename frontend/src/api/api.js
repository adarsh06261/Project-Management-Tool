import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Log the API URL in development (helps debug)
if (import.meta.env.DEV) {
  console.log("API URL:", apiUrl);
}

export const api = axios.create({
  baseURL: apiUrl,
});
