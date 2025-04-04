// ----------------- Details Page Functionality -----------------
const apiKey = '1789f687965581723d153630c6153e6b';
const detailsContainer = document.getElementById('details-container');
const extraMediaContainer = document.getElementById('extra-media-container');

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


// ----------------- Mobile Menu Toggle -----------------
// ✅ Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeButton = document.getElementById("close-button");

    if (menuButton && mobileMenu && closeButton) {
        // ✅ Open Mobile Menu
        menuButton.addEventListener("click", () => {
            console.log("📱 Opening mobile menu...");
            mobileMenu.classList.remove("translate-x-full");
            mobileMenu.classList.add("translate-x-0");
        });

        // ✅ Close Mobile Menu
        closeButton.addEventListener("click", () => {
            console.log("📱 Closing mobile menu...");
            mobileMenu.classList.remove("translate-x-0");
            mobileMenu.classList.add("translate-x-full");
        });
    }
});



const type = getQueryParam('type'); // 'movie' or 'tv'
const id = getQueryParam('id'); // Movie/Show ID

async function fetchDetails() {
    if (!id || !type) {
        detailsContainer.innerHTML = '<p class="text-red-500 text-center">Invalid request.</p>';
        return;
    }

    console.log(`🔍 Fetching details for ${type} ID: ${id}`);

    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ TMDb API Error: ${response.status} ${response.statusText}`);
            detailsContainer.innerHTML = '<p class="text-red-500 text-center">Movie/TV Show not found.</p>';
            return;
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        if (data) {
            displayDetails(data);
            fetchAdditionalMedia();
        } else {
            detailsContainer.innerHTML = '<p class="text-yellow-400 text-center">No details found.</p>';
        }
    } catch (error) {
        console.error('❌ Error fetching details:', error);
        detailsContainer.innerHTML = '<p class="text-red-500 text-center">Error fetching details.</p>';
    }
}

async function fetchAdditionalMedia() {
    if (!extraMediaContainer) {
        console.error("extraMediaContainer is missing in the HTML.");
        return;
    }

    const imagesUrl = `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${apiKey}`;

    try {
        const imagesResponse = await fetch(imagesUrl);
        const imagesData = await imagesResponse.json();
        displayExtraMedia(imagesData);
    } catch (error) {
        console.error('❌ Error fetching extra media:', error);
    }
}

function displayDetails(item) {
    detailsContainer.innerHTML = `
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img src="${item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}" 
                 alt="${item.title || item.name}" 
                 class="w-64 rounded-lg shadow-lg">
            <div class="text-left max-w-2xl">
                <h1 class="text-3xl font-bold text-yellow-400">${item.title || item.name}</h1>
                <p class="mt-2 text-gray-300 text-sm">
                    <strong>Release Date:</strong> ${item.release_date || item.first_air_date || 'Not Available'}
                </p>
                <p class="mt-2 text-gray-400">${item.overview || 'No description available.'}</p>
                <p class="mt-2 text-gray-300"><strong>Rating:</strong> ⭐ ${item.vote_average}/10</p>
                <p class="mt-2 text-gray-300"><strong>Genres:</strong> ${item.genres.map(g => g.name).join(', ') || 'N/A'}</p>
                <p class="mt-2 text-gray-300"><strong>Runtime:</strong> ${item.runtime ? item.runtime + ' min' : 'N/A'}</p>
                <p class="mt-2 text-gray-300"><strong>Status:</strong> ${item.status || 'N/A'}</p>
                <p class="mt-2 text-gray-300"><strong>Production Companies:</strong> ${item.production_companies.map(pc => pc.name).join(', ') || 'N/A'}</p>
                <div class="mt-4 flex gap-4">
                    <a href="https://www.justwatch.com/" target="_blank" class="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition">Watch Now</a>
                    <button id="watchLaterBtn" class="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition">Add to Watchlist</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("watchLaterBtn").addEventListener("click", function () {
        addToWatchLater(item.id, item.title || item.name, item.poster_path);
    });
}

function displayExtraMedia(imagesData) {
    if (!extraMediaContainer) return;

    let postersHtml = '';
    if (imagesData.backdrops && imagesData.backdrops.length > 0) {
        postersHtml = `
            <h2 class="text-2xl font-bold text-yellow-400 mt-6">More Scenes</h2>
            <div class="flex gap-4 overflow-x-scroll mt-2">
                ${imagesData.backdrops.slice(0, 10).map(img => `
                    <img src="https://image.tmdb.org/t/p/w500${img.file_path}" class="w-64 rounded shadow-lg">
                `).join('')}
            </div>
        `;
    }

    extraMediaContainer.innerHTML = postersHtml;
}

async function addToWatchLater(movieId, title, posterPath) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Please log in first!");
        return;
    }

    console.log(`🔍 Adding movie ID ${movieId} to watchlist...`);

    try {
        const response = await fetch("http://localhost:5000/watchlater", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ userId, movieId, title, poster: `https://image.tmdb.org/t/p/w500${posterPath}` })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Added to Watch Later!");
            console.log("✅ Watchlist Updated:", data);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Error adding to Watch Later:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchDetails();
});

// ----------------- Header & Mobile Menu / Login Status Handling -----------------

// Mobile Menu Toggle
const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const closeButton = document.getElementById("close-button");

menuButton?.addEventListener("click", () => {
    mobileMenu.classList.toggle("translate-x-full");
});
closeButton?.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
});

// Handle User Login Status & Logout (for header)
document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById("registerBtn");
    const signinBtn = document.getElementById("signinBtn");
    const userProfile = document.getElementById("userProfile");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = localStorage.getItem("token");

    if (token) {
        console.log("🔹 User is logged in, updating UI...");
        registerBtn?.classList.add("hidden");
        signinBtn?.classList.add("hidden");
        userProfile?.classList.remove("hidden");
        logoutBtn?.classList.remove("hidden");
    } else {
        console.log("🔹 No user logged in, showing Sign In/Register");
        userProfile?.classList.add("hidden");
        logoutBtn?.classList.add("hidden");
    }

    // Logout Function
    logoutBtn?.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        alert("Logged out successfully!");
        window.location.href = "../Register_and_Sign_up/signin.html"; // Redirect to Sign In
    });
});
