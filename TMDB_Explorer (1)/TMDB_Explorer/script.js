const API_KEY = "c84d9b10e1c2a9647a2ac2f412032668"; 
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch and display movies on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchPopularMovies();

    // Add event listeners for tabs
    document.getElementById("popular-tab").addEventListener("click", fetchPopularMovies);
    document.getElementById("top-rated-tab").addEventListener("click", fetchTopRatedMovies);

    // Add event listener for the search form
    document.getElementById("search-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const query = document.getElementById("query").value.trim();
        const type = document.getElementById("type").value;
        fetchSearchResults(query, type);
    });
});


function fetchPopularMovies() {
    setActiveTab("popular-tab");
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayMovies(data.results.slice(0, 10), "Popular Movies");
        })
        .catch((error) => console.error("Error fetching popular movies:", error));
}


function fetchTopRatedMovies() {
    setActiveTab("top-rated-tab");
    const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayMovies(data.results.slice(0, 10), "Top Rated Movies");
        })
        .catch((error) => console.error("Error fetching top-rated movies:", error));
}

// Fetch search results
function fetchSearchResults(query, type) {
    const url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=en-US&query=${query}&page=1`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (type === "movie") {
                displayMovies(data.results, "Search Results");
            } else if (type === "person") {
                displayPeople(data.results, "Search Results");
            }
        })
        .catch((error) => console.error("Error fetching search results:", error));
}


function displayMovies(movies, sectionTitle) {
    document.getElementById("section-title").textContent = sectionTitle;
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        // Fallback for missing image
        const imageUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : null;

        movieCard.innerHTML = `
            <div class="image-container">
                ${
                    imageUrl
                        ? `<img src="${imageUrl}" alt="${movie.title}">`
                        : `<div class="no-image">No Image Available</div>`
                }
            </div>
            <h3>${movie.title}</h3>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
        `;

        // Add click event to fetch and display movie details
        movieCard.addEventListener("click", () => {
            fetchMovieDetails(movie.id);
        });

        movieList.appendChild(movieCard);
    });
}


function displayPeople(people, sectionTitle) {
    document.getElementById("section-title").textContent = sectionTitle;
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    people.forEach((person) => {
        const personCard = document.createElement("div");
        personCard.classList.add("movie-card");

        // Fallback for missing image
        const imageUrl = person.profile_path
            ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
            : null;

        // Generate list of movies and TV shows
        const knownFor = person.known_for.map((item) => {
            if (item.media_type === "movie") {
                return `<li>Movie: ${item.title}</li>`;
            } else if (item.media_type === "tv") {
                return `<li>TV: ${item.name}</li>`;
            }
            return ""; // Fallback in case media_type is missing
        }).join("");

        personCard.innerHTML = `
            <div class="image-container">
                ${
                    imageUrl
                        ? `<img src="${imageUrl}" alt="${person.name}">`
                        : `<div class="no-image">No Image Available</div>`
                }
            </div>
            <h3>${person.name}</h3>
            <p><strong>Known For:</strong> ${person.known_for_department}</p>
            <ul><strong>Best Known For:</strong>${knownFor}</ul>
        `;

        movieList.appendChild(personCard);
    });
}


// Set active tab
function setActiveTab(tabId) {
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
}
// Fetch movie details by ID
function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const headers = {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjODRkOWIxMGUxYzJhOTY0N2EyYWMyZjQxMjAzMjY2OCIsIm5iZiI6MTczNDY0MjQxNC40MjksInN1YiI6IjY3NjQ4YWVlNjQ5ZjliZTk5YmIwOGEwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6sZh0Fqmbnc4hNlvF4eH6-xopbcZ44hobuZ3-V27emU", // Replace with your TMDB API token
        accept: "application/json",
    };

    fetch(url, { headers })
        .then((response) => response.json())
        .then((movie) => {
            displayMovieDetails(movie);
        })
        .catch((error) => {
            console.error("Error fetching movie details:", error);
            alert("Failed to fetch movie details. Please try again.");
        });
}


function displayMovieDetails(movie) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    const movieDetailsCard = document.createElement("div");
    movieDetailsCard.classList.add("movie-details-card");

    // Fallback for missing image
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    movieDetailsCard.innerHTML = `
        <div class="image-container">
            ${
                imageUrl
                    ? `<img src="${imageUrl}" alt="${movie.title}">`
                    : `<div class="no-image">No Image Available</div>`
            }
            <h2>${movie.title}</h2>
        </div>
        <div class="details">
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <p class="rating"><strong>Rating:</strong> ${movie.vote_average} / 10 (${movie.vote_count} votes)</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <button onclick="goBack()">Back</button>
        </div>
    `;

    movieList.appendChild(movieDetailsCard);
}

// Animate the logo on page load using anime.js
document.addEventListener("DOMContentLoaded", () => {
    // Initial bounce-in animation
    anime({
        targets: '#animated-logo',
        translateY: [-50, 0], // Moves the logo from -50px to its original position
        opacity: [0, 1], // Fades in the logo
        duration: 1000, // Duration of the animation in milliseconds
        easing: 'easeOutElastic(1, .8)', // Elastic easing for a smooth bounce effect
        complete: () => {
            // Continuous zoom-in and zoom-out animation
            anime({
                targets: '#animated-logo',
                scale: [1, 1.2], // Zoom in to 1.2x and back to 1x
                duration: 2000, // Duration of the animation cycle
                easing: 'easeInOutSine', // Smooth easing for zoom effect
                direction: 'alternate', // Alternates between zoom in and out
                loop: true // Keeps the animation continuous
            });
        }
    });
});



// Back button functionality
function goBack() {
    // Fetch and display the original list again
    fetchPopularMovies();
}
