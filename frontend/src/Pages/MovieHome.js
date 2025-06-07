import SearchBar from "./Components/SearchBar";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "./Components/styles/MovieHomeStyles.css";
import MovieCard from "./Components/MovieCard";
import { useEffect, useState } from "react";

const MovieHome = () => {
  const apiKey = "api_key=b97316ed479ee4226afefc88d1792909";
  const [list, setList] = useState([]);
  const [homeGenreList, setHomeGenreList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currMovies, setCurrMovies] = useState([]);

  useEffect(() => {
    // Getting the list of all movies from our Flask server for the search bar
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setList(data.arr));

    // Getting the list of all genres from TMDB
    fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
      .then((res) => res.json())
      .then((data) => setHomeGenreList(data.genres));
  }, []);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      fetch(
        `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&${apiKey}&release_date.lte=2019-12-12&with_genres=${encodeURI(
          selectedGenres.join(",")
        )}`
      )
        .then((res) => res.json())
        .then((data) => setCurrMovies(data.results));
    } else {
      setCurrMovies([]);
    }
  }, [selectedGenres]);

  const onTagClick = (genreId) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  const renderMovies = () =>
    currMovies.map((movie) => (
      <MovieCard
        key={`${movie.id}-${movie.original_title || movie.title}`}
        movie={movie}
      />
    ));

  return (

    <div className="container-fluid">
      <NavBar isHome={false} />
      <div className="HomePage">

          <div className="HomeSearch">
            {/* BingeBuddy animated title */}
            <div className="brand-title animated-brand mb-3">BingeBuddy!</div>
            {/* Search Bar */}
            <SearchBar movies={list} placeholder="Search for a Movie" />
          </div>

          <h2 className="genreHeader">Get Top Movies Based On Genre</h2>

          <div className="buttonGrid">
            {homeGenreList.map((genre) => (
              <div
                key={genre.id}
                onClick={() => onTagClick(genre.id)}
                className={
                  selectedGenres.includes(genre.id)
                    ? "genreTagON"
                    : "genreTagOFF"
                }
              >
                {genre.name}
                {selectedGenres.includes(genre.id) && (
                  <i className="fa fa-times" aria-hidden="true"></i>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="container-fluid HomeMovies">
          <div className="container HomeMovieGrid">
            {currMovies.length > 0 ? renderMovies() : null}
          </div>
        </div>

        <div className="HomeFooter">
          <Footer />
        </div>
      </div>
      );
};

      export default MovieHome;
