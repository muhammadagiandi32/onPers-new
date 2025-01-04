 * # Axios API Client Configuration
 * 
 * File ini digunakan untuk mengatur API Client menggunakan library `axios`. File ini menentukan:
 * - **Base URL**: Mendukung penggunaan di emulator dan perangkat fisik.
 * - **Headers**: Menggunakan JSON sebagai format data.
 * - **Timeout**: Permintaan API akan gagal jika tidak ada respons dalam 10 detik.
 * 
 * ## Fitur
 * 1. Mendukung Emulator dan Perangkat Fisik:
 *    - Jika menggunakan emulator, atur `isEmulator` ke `true` dan gunakan `http://10.0.2.2:8000/api` sebagai base URL.
 *    - Jika tidak menggunakan emulator (perangkat fisik), atur `isEmulator` ke `false` dan pastikan Anda mengganti base URL dengan IP komputer yang digunakan di laptop Anda.
 * 
 * 2. Headers:
 *    - Semua permintaan API menggunakan `Content-Type: application/json`.
 * 
 * 3. Timeout:
 *    - Batas waktu 10 detik untuk permintaan API.
 * 
 * ## Konfigurasi
 * 1. Atur `isEmulator`:
 *    - `true` jika Anda menggunakan emulator.
 *    - `false` jika Anda menggunakan perangkat fisik dan pastikan base URL sesuai dengan IP komputer Anda.
 * 
 * 2. Base URL untuk perangkat fisik:
 *    - Ganti `http://172.16.100.48:7780/api` dengan IP komputer Anda di jaringan lokal yang sama dengan perangkat fisik.
 *    - Pastikan backend server berjalan di IP dan port yang sesuai.
 * 
 
