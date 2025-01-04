import axios from 'axios';
// Periksa apakah Anda menjalankan di emulator atau perangkat fisik
const isEmulator = false; // Set `true` jika Anda menggunakan emulator

const api = axios.create({
    baseURL: isEmulator ?
        "http://10.0.2.2:8000/api" // URL untuk Android Emulator (10.0.2.2)
        :
        "http://172.16.100.48:7780/api", // Ganti dengan IP komputer untuk perangkat fisik
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // Batas waktu permintaan
});


export default api;