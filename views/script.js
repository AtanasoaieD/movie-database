var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;

//API Data
const API_KEY = "api_key=4590cf2b1b1b3138ac999c440491aae0";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;
// const API_URL =
//   "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=4590cf2b1b1b3138ac999c440491aae0";

//movies genre
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const h1 = document.getElementById("h1");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
const tagsEl = document.getElementById("tags");

//selected genre
var selectedGenre = [];

setGenre();
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;

    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    tagsEl.append(t);
  });
}

//highlight genre selection

function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });

  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add("highlight");
    });
  }
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "hightlight");
    clear.id = "clear";
    clear.innerText = "Clear X";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();

      getMovies(API_URL);
    });
    tagsEl.append(clear);
  }
}

// Get initial movies

getMovies(API_URL);

async function getMovies(url) {
  lastUrl = url;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.results);

  if (data.results.length !== 0) {
    showMovies(data.results);
    currentPage = data.page;
    nextPage = currentPage + 1;
    prevPage = currentPage - 1;
    totalPages = data.total_pages;

    current.innerText = currentPage;

    if (currentPage <= 1) {
      prev.classList.add("disabled");
      next.classList.remove("disabled");
    } else if (currentPage >= totalPages) {
      prev.classList.remove("disabled");
      next.classList.add("disabled");
    } else {
      prev.classList.remove("disabled");
      next.classList.remove("disabled");
    }
  } else {
    main.innerHTML = `<h1 class = "no-result">No results found</h1>`;
  }
}

function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
   
    <img src="${
      poster_path
        ? IMG_PATH + poster_path
        : "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg"
    }" alt="${title}">
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
//Rate movies

function getClassByRate(vote) {
  if (vote >= 8) {
    return "lightgreen";
  } else if (vote > 5) {
    return "yellow";
  } else {
    return "orangered";
  }
}

//Next Page

next.addEventListener("click", () => {
  console.log("yes");
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

//Previous Page

prev.addEventListener("click", () => {
  console.log("yes");
  if (prevPage <= totalPages) {
    pageCall(prevPage);
  }
});

//Pagination

function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
    var scrollToTop = window.scrollTo(0, 0);
  }
}

//Search functionality

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm && searchTerm !== "") {
    getMovies(searchURL + `&query=` + searchTerm);
    // search.value = "";
  } else {
    getMovies(API_URL);
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

//homepage
const title = function () {
  window.location.href = "/";
};
h1.addEventListener("click", title);
