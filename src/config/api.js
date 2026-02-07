import axios from "axios";

const API = axios.create({
  baseURL: "https://<your-render-backend-url>",
  withCredentials: true
});

export default API;
