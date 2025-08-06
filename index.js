// index.js (Versi TANPA folder public)

const express = require('express');
const axios = require('axios');
const path = require('path'); // Pustaka 'path' dibutuhkan
const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// BAGIAN INI DIUBAH
// Server file HTML, CSS, dan JS secara manual

// 1. Sajikan file index.html saat orang membuka halaman utama ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Sajikan file style.css saat browser memintanya
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// 3. Sajikan file script.js saat browser memintanya
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});
// ======================================================


// Route untuk API downloader (INI TETAP SAMA)
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'URL video tidak boleh kosong.' });
    }

    const apiKey = 'au-8xY1ATRg';
    const apiUrl = `https://api.alvianuxio.eu.org/api/aio/v2?url=${encodeURIComponent(videoUrl)}&apikey=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengambil data dari API. Mungkin URL tidak valid atau server API sedang down.' 
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});