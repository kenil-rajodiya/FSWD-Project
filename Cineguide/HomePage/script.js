const apiKey = '1789f687965581723d153630c6153e6b';

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


// ----------------- DOMContentLoaded -----------------
document.addEventListener("DOMContentLoaded", function () {
    // Attach event listeners for Register Form
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    // Attach event listeners for Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }

    // Attach event listener for Logout Button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }

    // Update UI based on login status
    updateUI();
});

// ----------------- UI Update Functions -----------------
function updateUI() {
    const token = localStorage.getItem("token");
    const registerBtn = document.getElementById("registerBtn");
    const signinBtn = document.getElementById("signinBtn");
    const userProfile = document.getElementById("userProfile");

    if (token) {
        console.log("🔹 User is logged in, updating UI...");
        if (registerBtn) registerBtn.classList.add("hidden");
        if (signinBtn) signinBtn.classList.add("hidden");
        if (userProfile) userProfile.classList.remove("hidden");
    } else {
        console.log("🔹 No user logged in, showing Sign In/Register");
        if (registerBtn) registerBtn.classList.remove("hidden");
        if (signinBtn) signinBtn.classList.remove("hidden");
        if (userProfile) userProfile.classList.add("hidden");
    }
}

// ----------------- Login User Function -----------------
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    console.log("🔹 Sending Login Request:", { email, password });

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("🔍 Server Response:", data);

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            alert("Login successful!");
            updateUI();
            window.location.href = "../HomePage/index.html"; // Redirect to homepage
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        alert("Login failed. Check console for details.");
    }
}

// ----------------- Register User Function -----------------
async function registerUser(event) {
    event.preventDefault();

    // Get input elements (IDs must match your HTML)
    const usernameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (!usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        console.error("❌ One or more input elements are missing.");
        alert("Error: Some fields are missing in the form.");
        return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
            alert("User registered successfully! Please log in.");
            window.location.href = "../Register_and_Sign_up/signin.html"; // Redirect to Sign In page
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error registering:", error);
        alert("Registration failed. Check console for details.");
    }
}

// ----------------- Logout Function -----------------
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("Logged out successfully!");
    updateUI();
    window.location.href = "../Register_and_Sign_up/signin.html"; // Redirect to Sign In page
}

// ----------------- Trending Movies Section -----------------
const movieResults = document.getElementById('movie-results');

async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US`);
        const data = await response.json();

        if (data.results?.length > 0) {
            displayMovies(data.results);
        } else {
            movieResults.innerHTML = '<p>No Movies found. Try again later.</p>';
        }
    } catch (error) {
        console.error('❌ Error fetching movies:', error);
        movieResults.innerHTML = '<p>There was an error fetching data.</p>';
    }
}

function displayMovies(movies) {
    movieResults.innerHTML = '';

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('rounded-lg', 'overflow-hidden', 'shadow-lg', 'snap-center', 'mr-2', 'ml-2', 'border', 'border-yellow-400', 'lg:mr-3', 'lg:ml-3');

        const movieLink = document.createElement('a');
        movieLink.href = `../Details/details.html?type=movie&id=${movie.id}`;
        movieLink.classList.add('block');

        const movieCard = document.createElement('div');

        const moviePoster = document.createElement('img');
        moviePoster.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';
        moviePoster.alt = movie.original_title;
        moviePoster.classList.add('w-full', 'h-64', 'object-cover', 'hover:opacity-75', 'rounded-lg', 'sm:h-72');

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = movie.original_title;
        movieTitle.classList.add('text-yellow-600', 'font-bold', 'mt-4', 'text-center', 'text-xl');

        const movieReleaseDate = document.createElement('p');
        movieReleaseDate.textContent = movie.release_date || 'Release date not available';
        movieReleaseDate.classList.add('text-white', 'text-sm', 'mt-2', 'text-center');

        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieReleaseDate);

        movieLink.appendChild(movieCard);
        movieDiv.appendChild(movieLink);
        movieResults.appendChild(movieDiv);
    });
}

// ----------------- Trending TV Shows Section -----------------
const showsResults = document.getElementById('shows-results');

async function fetchShows() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&language=en-US`);
        const data = await response.json();

        if (data.results?.length > 0) {
            displayShows(data.results);
        } else {
            showsResults.innerHTML = '<p>No TV shows found. Try again later.</p>';
        }
    } catch (error) {
        console.error('❌ Error fetching TV shows:', error);
        showsResults.innerHTML = '<p>There was an error fetching data.</p>';
    }
}

function displayShows(shows) {
    showsResults.innerHTML = '';

    shows.forEach(show => {
        const showDiv = document.createElement('div');
        showDiv.classList.add('rounded-lg', 'overflow-hidden', 'shadow-lg', 'snap-center', 'mr-2', 'ml-2', 'border', 'border-yellow-400', 'lg:mr-3', 'lg:ml-3');

        const showLink = document.createElement('a');
        showLink.href = `../Details/details.html?type=tv&id=${show.id}`;
        showLink.classList.add('block');

        const showCard = document.createElement('div');

        const showPoster = document.createElement('img');
        showPoster.src = show.poster_path
            ? `https://image.tmdb.org/t/p/original${show.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';
        showPoster.alt = show.name;
        showPoster.classList.add('w-full', 'h-64', 'object-cover', 'hover:opacity-75', 'rounded-lg', 'sm:h-72');

        const showTitle = document.createElement('h3');
        showTitle.textContent = show.name;
        showTitle.classList.add('text-yellow-600', 'font-bold', 'mt-4', 'text-center', 'text-xl');

        const showReleaseDate = document.createElement('p');
        showReleaseDate.textContent = show.first_air_date || 'Release date not available';
        showReleaseDate.classList.add('text-white', 'text-sm', 'mt-2', 'text-center');

        showCard.appendChild(showPoster);
        showCard.appendChild(showTitle);
        showCard.appendChild(showReleaseDate);

        showLink.appendChild(showCard);
        showDiv.appendChild(showLink);
        showsResults.appendChild(showDiv);
    });
}

// ----------------- Load Movies & TV Shows -----------------
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    fetchShows();
});
