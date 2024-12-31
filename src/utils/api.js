import axios from 'axios';

// Ganti dengan URL backend Laravel Anda
const API_BASE_URL = 'http://10.0.2.2:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;