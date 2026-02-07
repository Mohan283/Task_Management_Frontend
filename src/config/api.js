import axios from "axios";

const API = axios.create({
  baseURL: "https://task-management-backend-new-2bky.onrender.com/",
  withCredentials: true
});

export default API;
