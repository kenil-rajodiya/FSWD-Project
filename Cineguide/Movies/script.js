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


// ----------------- Handle User Login Status in Header -----------------
document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById("registerBtn");
    const signinBtn = document.getElementById("signinBtn");
    const userProfile = document.getElementById("userProfile");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = localStorage.getItem("token");

    if (token) {
        console.log("🔹 User is logged in, updating header UI...");
        if (registerBtn) registerBtn.classList.add("hidden");
        if (signinBtn) signinBtn.classList.add("hidden");
        if (userProfile) userProfile.classList.remove("hidden");
        if (logoutBtn) logoutBtn.classList.remove("hidden");
    } else {
        console.log("🔹 No user logged in, showing Sign In/Register in header");
        if (userProfile) userProfile.classList.add("hidden");
        if (logoutBtn) logoutBtn.classList.add("hidden");
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            alert("Logged out successfully!");
            window.location.href = "../Register_and_Sign_up/signin.html"; // Redirect to Sign In page
        });
    }
});

const apiKey = '1789f687965581723d153630c6153e6b';

// Select movie results container
const movieResults = document.getElementById('movie-results');

async function fetchMovies() {
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
        } else {
            movieResults.innerHTML = '<p>No Movies found. Try again later.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        movieResults.innerHTML = '<p>There was an error fetching data.</p>';
    }
}


function displayMovies(movies) {
    movieResults.innerHTML = '';

    let movieLimit = window.innerWidth > 1024 ? 10 : 6;
    const displayedMovies = movies.slice(0, movieLimit);

    displayedMovies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('rounded-lg', 'overflow-hidden', 'shadow-lg', 'border', 'border-yellow-400', 'p-2');

        // ✅ Wrap movie in <a> tag to make it clickable
        const movieLink = document.createElement('a');
        movieLink.href = `../Details/details.html?type=movie&id=${movie.id}`; // Pass movie ID in URL
        movieLink.classList.add('block');

        const moviePoster = document.createElement('img');
        moviePoster.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';
        moviePoster.alt = movie.title;
        moviePoster.classList.add('w-full', 'h-32', 'object-cover', 'hover:opacity-75', 'rounded-lg', 'sm:h-72');

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = movie.title;
        movieTitle.classList.add('text-yellow-600', 'font-bold', 'mt-4', 'text-center', 'text-lg');

        movieLink.appendChild(moviePoster);
        movieLink.appendChild(movieTitle);
        movieDiv.appendChild(movieLink);
        movieResults.appendChild(movieDiv);
    });
}








// Fetch movies on page load
document.addEventListener('DOMContentLoaded', fetchMovies);

// Update movie list on window resize
window.addEventListener('resize', fetchMovies);

//trending Movies section ends




//search functionality starts here
const searchinput = document.getElementById('searchInput');
const searchbtn = document.getElementById('searchBtn');

searchinput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchMovie(searchinput.value.trim());
    }
})
searchbtn.addEventListener('click', function (event) {
    searchMovie(searchinput.value.trim());

})

async function searchMovie(query) {
    if (!query) return; // Don't search empty queries

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    const movietag = document.getElementById('movieTag');
    movietag.classList.add("font-semibold")

    movietag.innerHTML = `&nbsp; &nbsp;Results For '${query}' &nbsp;`

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {

            displayMovies(data.results);
        } else {
            movieResults.innerHTML = '<p class="text-yellow-400 text-center">No results found.</p>';
        }
    } catch (error) {
        console.error('Error fetching movie:', error);
        movieResults.innerHTML = '<p class="text-red-500 text-center">Error fetching movie.</p>';
    }
}

