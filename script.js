// Ganti dengan API Key NASA kamu
const API_KEY = 'hREMBH9Tn9bYUQL2L8YhW01RZ2Pn33r8ptrYcD8J'; 

// Elemen APOD
const apodContent = document.getElementById('apod');
const apodTitle = document.getElementById('apod-title');
const apodImage = document.getElementById('apod-image');
const apodExplanation = document.getElementById('apod-explanation');

// Elemen Mars Rover
const marsContent = document.getElementById('mars');
const marsPhotosGrid = document.getElementById('mars-photos-grid');

// Elemen Image Search
const searchContent = document.getElementById('search');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResultsGrid = document.getElementById('search-results-grid');

// Elemen EONET
const eonetContent = document.getElementById('eonet');
const eonetEventsList = document.getElementById('eonet-events-list');

// Elemen Umum
const loader = document.getElementById('loader');
const tabs = document.querySelector('.tabs');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// --- Fungsi Utama untuk Mengambil Data ---

// Fungsi 1: Ambil data APOD
async function fetchAPOD() {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
        const data = await response.json();
        
        if (data.media_type === 'image') {
            apodTitle.textContent = data.title;
            apodImage.src = data.url;
            apodExplanation.textContent = data.explanation;
        } else {
            apodTitle.textContent = data.title;
            apodImage.src = 'https://via.placeholder.com/900x600.png?text=Konten+Hari+Ini+Adalah+Video';
            apodExplanation.textContent = 'Konten hari ini adalah video.';
        }
    } catch (error) {
        apodTitle.textContent = 'Gagal mengambil data APOD.';
        console.error(error);
    } finally {
        loader.classList.add('hidden');
    }
}

// Fungsi 2: Ambil foto Mars Rover
async function fetchMarsPhotos() {
    loader.classList.remove('hidden');
    marsPhotosGrid.innerHTML = '';
    try {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}`);
        const data = await response.json();

        if (data.photos.length > 0) {
            data.photos.slice(0, 15).forEach(photo => { 
                const photoItem = document.createElement('div');
                photoItem.className = 'mars-photo-item';
                photoItem.innerHTML = `<img src="${photo.img_src}" alt="Mars Rover Photo">`;
                marsPhotosGrid.appendChild(photoItem);
            });
        } else {
            marsPhotosGrid.innerHTML = '<p>Tidak ada foto yang tersedia.</p>';
        }
    } catch (error) {
        marsPhotosGrid.innerHTML = '<p>Gagal mengambil foto dari Mars Rover.</p>';
        console.error(error);
    } finally {
        loader.classList.add('hidden');
    }
}

// Fungsi 3: Cari gambar NASA
async function searchNASAImages(query) {
    loader.classList.remove('hidden');
    searchResultsGrid.innerHTML = '';
    try {
        const response = await fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image`);
        const data = await response.json();

        const items = data.collection.items;
        if (items.length > 0) {
            items.slice(0, 20).forEach(item => {
                const imageUrl = item.links[0].href;
                const imageTitle = item.data[0].title;
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `<img src="${imageUrl}" alt="${imageTitle}">`;
                searchResultsGrid.appendChild(resultItem);
            });
        } else {
            searchResultsGrid.innerHTML = '<p>Tidak ada hasil yang ditemukan.</p>';
        }
    } catch (error) {
        searchResultsGrid.innerHTML = '<p>Gagal mencari gambar.</p>';
        console.error(error);
    } finally {
        loader.classList.add('hidden');
    }
}

// Fungsi 4: Ambil data EONET
async function fetchEONETEvents() {
    loader.classList.remove('hidden');
    eonetEventsList.innerHTML = '';
    try {
        const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events`);
        const data = await response.json();

        if (data.events && data.events.length > 0) {
            data.events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'eonet-event-item';
                eventItem.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Status:</strong> ${event.status}</p>
                    <p><strong>Kategori:</strong> ${event.categories.map(cat => cat.title).join(', ')}</p>
                `;
                eonetEventsList.appendChild(eventItem);
            });
        } else {
            eonetEventsList.innerHTML = '<p>Tidak ada peristiwa alam yang aktif saat ini.</p>';
        }
    } catch (error) {
        eonetEventsList.innerHTML = '<p>Gagal mengambil data EONET.</p>';
        console.error(error);
    } finally {
        loader.classList.add('hidden');
    }
}

// --- Fungsi untuk Mengatur Tab ---
function switchTab(targetTab) {
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.add('hidden'));

    const activeTabButton = document.querySelector(`[data-tab="${targetTab}"]`);
    activeTabButton.classList.add('active');

    const activeTabContent = document.getElementById(targetTab);
    activeTabContent.classList.remove('hidden');

    if (targetTab === 'apod') {
        fetchAPOD();
    } else if (targetTab === 'mars') {
        fetchMarsPhotos();
    } else if (targetTab === 'search') {
        // Tidak perlu memuat apa-apa, karena pengguna akan mencari sendiri
    } else if (targetTab === 'eonet') {
        fetchEONETEvents();
    }
}

// Event Listeners
tabs.addEventListener('click', (event) => {
    if (event.target.matches('.tab-button')) {
        switchTab(event.target.dataset.tab);
    }
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchNASAImages(query);
    }
});

// Panggil fungsi APOD saat halaman pertama kali dimuat
fetchAPOD();