// src/services/api.ts
import axios from "axios";

// Cria uma "instância" do Axios
const api = axios.create({
    baseURL: "http://localhost:8080" // A URL base do seu backend
});

export default api;