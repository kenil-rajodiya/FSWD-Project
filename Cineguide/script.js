// const apiKey = '1789f687965581723d153630c6153e6b'; // Replace with your TMDb API key
// const searchButton = document.getElementById('search-button');
// const movieResults = document.getElementById('movie-results');

// // Function to fetch movie data from TMDb API
// async function fetchMovies(query) {
//     const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         // If we get results, display them
//         if (data.results.length > 0) {
//             displayMovies(data.results);
//         } else {
//             movieResults.innerHTML = '<p>No movies found. Try another search.</p>';
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         movieResults.innerHTML = '<p>There was an error fetching data.</p>';
//     }
// }

// // Function to display movies
// function displayMovies(movies) {
//     movieResults.innerHTML = ''; // Clear previous results

//     movies.forEach(movie => {
//         const movieCard = document.createElement('div');
//         movieCard.classList.add('movie-card');

//         const moviePoster = movie.poster_path
//             ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//             : 'https://via.placeholder.com/500x750?text=No+Poster';

//         movieCard.innerHTML = `
//       <img src="${moviePoster}" alt="${movie.title}">
//       <h3>${movie.title}</h3>
//       <p>${movie.release_date}</p>
//     `;

//         movieResults.appendChild(movieCard);
//     });
// }

// // Add event listener to search button
// searchButton.addEventListener('click', () => {
//     const query = document.getElementById('movie-search').value;
//     if (query) {
//         fetchMovies(query);
//     } else {
//         movieResults.innerHTML = '<p>Please enter a movie title.</p>';
//     }
// });


