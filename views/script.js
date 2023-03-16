const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc550&api_key=4590cf2b1b1b3138ac999c440491aae0&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=4590cf2b1b1b3138ac999c440491aae0&query="';

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const h1 = document.getElementById("h1");
// Get initial movies

getMovies(API_URL);

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.results);

  showMovies(data.results);
}
function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
   
    <img src="${IMG_PATH + poster_path}" alt="${title}">
    <div class="movie-info">
      <h3>${title}</h3>
      <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
        <h3>Description</h3>
        ${overview}
    </div>
   
    `;
    main.appendChild(movieEl);
  });
}
// function getClassByRate() {
//   let vote = 10;
//   let rate = vote >= 9 ? {"lightgreen"} : vote >= 5 ? "yellow" : "orangered";}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "lightgreen";
  } else if (vote >= 5) {
    return "yellow";
  } else {
    return "orangered";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else {
    window.location.reload();
  }
});

// get modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
openModalBtn.addEventListener("click", openModal);

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

overlay.addEventListener("click", closeModal);

// closemodal by pressing escape

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  } else {
    closeModal();
  }
});

const title = function () {
  window.location.href = "/";
};
h1.addEventListener("click", title);
