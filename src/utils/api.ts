import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_API_BASE_URL;

axios.defaults.headers.common["Content-Type"] = "application/json";
// axios.defaults.timeout = 30000;

export const api = axios.create();
