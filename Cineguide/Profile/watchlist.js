








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



document.addEventListener("DOMContentLoaded", function () {
    const watchlistContainer = document.getElementById("watchlist-container");
    const logoutBtn = document.getElementById("logoutBtn");
    const registerBtn = document.getElementById("registerBtn");
    const signinBtn = document.getElementById("signinBtn");
    const userProfile = document.getElementById("userProfile");

    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("You need to log in to access your watchlist.");
        window.location.href = "../Register_and_Sign_up/signin.html";
        return;
    }

    // ✅ Hide Register & Sign In, Show Profile & Logout
    if (registerBtn) registerBtn.classList.add("hidden");
    if (signinBtn) signinBtn.classList.add("hidden");
    if (userProfile) userProfile.classList.remove("hidden");

    // ✅ Logout Functionality
    logoutBtn?.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        alert("Logged out successfully!");
        window.location.href = "../Register_and_Sign_up/signin.html"; // Redirect to Sign In
    });

    // ✅ Fetch and Display Watchlist
    fetchWatchlist();
});

// ✅ Fetch Watchlist from Server
// async function fetchWatchlist() {
//     try {
//         const userId = localStorage.getItem("userId");
//         const response = await fetch(`http://localhost:5000/watchlater/${userId}`);
//         const data = await response.json();

//         if (!data.watchLater || data.watchLater.length === 0) {
//             document.getElementById("watchlist-container").innerHTML =
//                 "<p class='text-center text-gray-400 mt-6'>Your watchlist is empty.</p>";
//             return;
//         }

//         let validMovies = [];

//         for (const movieId of data.watchLater) {
//             const response = await fetch(
//                 `https://api.themoviedb.org/3/movie/${movieId}?api_key=1789f687965581723d153630c6153e6b&language=en-US`
//             );

//             if (response.ok) {
//                 validMovies.push(movieId);
//             } else {
//                 console.warn(`🚨 Movie ID ${movieId} not found. Removing from watchlist...`);
//                 await removeFromWatchlist(movieId, false);
//             }
//         }

//         displayWatchlist(validMovies);

//     } catch (error) {
//         console.error("❌ Error fetching watchlist:", error);
//     }
// }


// ✅ Function to Find Correct Movie ID if the given ID is invalid
async function findCorrectMovieId(movieId) {
    try {
        console.log(`🔍 Searching for correct ID for Movie ID: ${movieId}`);

        let searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=1789f687965581723d153630c6153e6b&query=${movieId}`
        );
        let searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
            let correctId = searchData.results[0].id;
            console.log(`✅ Found correct ID: ${correctId} for Movie ID: ${movieId}`);
            return correctId; // ✅ Return the first matched movie ID
        }
    } catch (error) {
        console.error("❌ Error finding correct movie ID:", error);
    }
    return null; // ❌ No valid movie found
}

// ✅ Fetch Watchlist from Server
async function fetchWatchlist() {
    try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:5000/watchlater/${userId}`);
        const data = await response.json();

        if (!data.watchLater || data.watchLater.length === 0) {
            document.getElementById("watchlist-container").innerHTML =
                "<p class='text-center text-gray-400 mt-6'>Your watchlist is empty.</p>";
            return;
        }

        let validMovies = [];

        for (const movieId of data.watchLater) {
            let response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=1789f687965581723d153630c6153e6b&language=en-US`
            );

            if (response.ok) {
                validMovies.push(movieId);
            } else {
                console.warn(`🚨 Movie ID ${movieId} not found. Attempting to find correct ID...`);

                let correctId = await findCorrectMovieId(movieId);

                if (correctId) {
                    validMovies.push(correctId); // ✅ Add the corrected ID
                } else {
                    console.warn(`❌ No valid alternative found for Movie ID: ${movieId}. Removing from watchlist...`);
                    await removeFromWatchlist(movieId, false);
                }
            }
        }

        displayWatchlist(validMovies);

    } catch (error) {
        console.error("❌ Error fetching watchlist:", error);
    }
}










// ✅ Display Watchlist with Improved Handling for Invalid Movies
async function displayWatchlist(movieIds) {
    const watchlistContainer = document.getElementById("watchlist-container");
    watchlistContainer.innerHTML = "";

    for (const movieId of movieIds) {
        if (!movieId || isNaN(movieId)) {
            console.warn(`🚨 Invalid movie ID detected: ${movieId}, skipping...`);
            continue;
        }

        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=1789f687965581723d153630c6153e6b&language=en-US`
            );

            if (!response.ok) {
                console.warn(`🚨 Movie ID ${movieId} not found on TMDB. Removing from watchlist...`);
                await removeFromWatchlist(movieId, false); // Automatically remove invalid movies
                continue;
            }

            const movie = await response.json();
            createMovieCard(movie, watchlistContainer);

        } catch (error) {
            console.error(`❌ Error fetching movie ID ${movieId}:`, error);
        }
    }
}

// ✅ Define `createMovieCard()` to handle UI updates
function createMovieCard(movie, container) {
    const movieCard = document.createElement("div");
    movieCard.setAttribute("id", `movie-${movie.id}`); // ✅ Unique ID for removal
    movieCard.classList.add(
        "relative", "bg-black", "border", "border-yellow-500",
        "rounded-lg", "overflow-hidden", "shadow-lg",
        "hover:z-1", "hover:shadow-xl", "hover:scale-105", "transition", "duration-500",
        "w-40", "sm:w-48", "md:w-52", "lg:w-56"
    );

    const movieLink = document.createElement("a");
    movieLink.href = `../Details/details.html?type=movie&id=${movie.id}`;
    movieLink.classList.add("block");

    const moviePoster = document.createElement("img");
    moviePoster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "../assets/no-poster.png";
    moviePoster.alt = movie.title;
    moviePoster.classList.add("w-full", "h-52", "object-cover", "rounded-t-lg");

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.title;
    movieTitle.classList.add("text-yellow-400", "font-bold", "text-center", "mt-2", "mb-2", "text-sm");

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add(
        "absolute", "top-2", "right-2", "bg-red-600", "px-2", "py-1",
        "text-white", "rounded-md", "text-xs", "hover:bg-red-700", "transition"
    );
    removeButton.onclick = () => removeFromWatchlist(movie.id, true);

    movieLink.appendChild(moviePoster);
    movieCard.appendChild(movieLink);
    movieCard.appendChild(movieTitle);
    movieCard.appendChild(removeButton);
    container.appendChild(movieCard);
}

// ✅ Remove from Watchlist (Fixed API Request)
async function removeFromWatchlist(movieId, updateUI = true) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("You need to log in first.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/watchlater/${userId}/${movieId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            if (updateUI) {
                document.getElementById(`movie-${movieId}`)?.remove(); // ✅ Remove from UI
                alert("Removed from Watchlist!");
            }
        } else {
            console.error("❌ Error removing from Watchlist:", response);
        }
    } catch (error) {
        console.error("❌ Error removing from Watchlist:", error);
        alert("An error occurred while removing from Watchlist.");
    }
}


