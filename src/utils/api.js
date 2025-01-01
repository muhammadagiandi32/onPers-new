import axios from 'axios';
// Periksa apakah Anda menjalankan di emulator atau perangkat fisik
const isEmulator = true; // Set `true` jika Anda menggunakan emulator

const api = axios.create({
    baseURL: isEmulator ?
        "http://10.0.2.2:8000/api" // URL untuk Android Emulator (10.0.2.2)
        :
        "http://192.168.43.184:8000/api", // Ganti dengan IP komputer untuk perangkat fisik
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // Batas waktu permintaan
});


export default api;