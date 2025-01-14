import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080/api";
axios.defaults.headers.common["Content-Type"] = "application/json";
// axios.defaults.timeout = 30000;

export const api = axios.create();
