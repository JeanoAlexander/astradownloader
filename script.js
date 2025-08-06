// script.js (Client-Side Logic & Animation)

document.addEventListener('DOMContentLoaded', () => {
    // === Elemen DOM ===
    const videoUrlInput = document.getElementById('videoUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusText = document.getElementById('statusText');
    const loader = document.getElementById('loader');
    const resultsContainer = document.getElementById('results');

    // === Animasi Pembuka yang Kompleks ===
    const timeline = anime.timeline({
        easing: 'easeOutExpo',
    });

    timeline
    .add({
        targets: '.container',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800
    })
    .add({
        targets: '.title, .subtitle',
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
        delay: anime.stagger(100)
    }, '-=400')
    .add({
        targets: '.form-container > *',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        delay: anime.stagger(150)
    }, '-=500')
    .add({
        targets: '.footer',
        opacity: [0, 1],
        duration: 700
    }, '-=300');
    
    // === Animasi Loader yang Mirip Robot/Sistem ===
    const loaderAnimation = anime({
        targets: '.loader .bar',
        height: ['5px', '40px'],
        duration: 400,
        easing: 'easeInOutQuad',
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(100)
    });
    loaderAnimation.pause(); // Mulai dalam keadaan berhenti

    // === Event Listener untuk Tombol Download ===
    downloadBtn.addEventListener('click', async () => {
        const url = videoUrlInput.value.trim();
        if (!url) {
            showStatus('URL tidak boleh kosong. Silakan tempelkan URL video.', 'error');
            anime({ targets: '#videoUrl', translateX: [-5, 5, -5, 5, 0], duration: 300, easing: 'easeInOutSine' });
            return;
        }

        startLoading();

        try {
            // Memanggil backend (server Express)
            const response = await fetch(`/download?url=${encodeURIComponent(url)}`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal memproses permintaan.');
            }
            
            displayResults(result.data.data);

        } catch (error) {
            showStatus(error.message, 'error');
        } finally {
            stopLoading();
        }
    });

    // === Fungsi-fungsi Bantuan ===

    function startLoading() {
        showStatus('Menganalisis & memproses tautan...', 'loading');
        loader.style.display = 'flex';
        loaderAnimation.play();
        resultsContainer.innerHTML = '';
        resultsContainer.style.opacity = 0;
        downloadBtn.disabled = true;
        anime({ targets: downloadBtn, opacity: 0.5, duration: 300 });
    }

    function stopLoading() {
        loader.style.display = 'none';
        loaderAnimation.pause();
        downloadBtn.disabled = false;
        anime({ targets: downloadBtn, opacity: 1, duration: 300 });
    }

    function showStatus(message, type = 'info') {
        statusText.textContent = message;
        if (type === 'error') {
            statusText.style.color = '#ff6b6b';
        } else if (type === 'success') {
            statusText.style.color = '#50fa7b';
        } else {
            statusText.style.color = 'var(--text-color)';
        }
    }

    function displayResults(data) {
        if (!data) {
            showStatus('Tidak ada data yang ditemukan untuk URL ini.', 'error');
            return;
        }

        showStatus('Berhasil!', 'success');
        resultsContainer.innerHTML = ''; // Bersihkan hasil sebelumnya

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        let contentHTML = `<h2>${data.title || 'Judul Tidak Ditemukan'}</h2>`;
        contentHTML += '<div class="result-content">';

        if (data.thumbnail) {
            contentHTML += `<img src="${data.thumbnail}" alt="Thumbnail">`;
        }

        contentHTML += '<div class="download-links">';

        // Links Video
        if (data.links && data.links.length > 0) {
            contentHTML += '<h3>Unduh Video:</h3><div class="link-group">';
            data.links.forEach(link => {
                contentHTML += `<a href="${link.url}" target="_blank" download>
                    ${link.quality} (${link.size || 'N/A'}) <small>[${link.type}]</small>
                </a>`;
            });
            contentHTML += '</div>';
        }

        // Links Audio
        if (data.audio_links && data.audio_links.length > 0) {
            contentHTML += '<h3 style="margin-top: 15px;">Unduh Audio:</h3><div class="link-group">';
            data.audio_links.forEach(link => {
                contentHTML += `<a href="${link.url}" target="_blank" download>
                    ${link.quality} (${link.size || 'N/A'}) <small>[${link.type}]</small>
                </a>`;
            });
            contentHTML += '</div>';
        }
        
        contentHTML += '</div></div>';
        resultItem.innerHTML = contentHTML;
        resultsContainer.appendChild(resultItem);

        // Animasi untuk menampilkan hasil
        anime({
            targets: resultsContainer,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });
    }
});