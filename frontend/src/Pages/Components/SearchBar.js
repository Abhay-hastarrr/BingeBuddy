import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import "./styles/SearchBarStyles.css";

const TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8"; // Your TMDb API key

function SearchBar({ placeholder }) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: TMDB_API_KEY,
            query,
          },
        }
      );

      let results = response.data.results || [];

      // Filter & sort by popularity
      results = results
        .filter((movie) => movie.vote_count > 50 && movie.poster_path)
        .sort((a, b) => b.popularity - a.popularity);

      // Use Fuse.js for fuzzy matching
      const fuse = new Fuse(results, {
        keys: ["title"],
        threshold: 0.4,
      });

      const fuzzyResults = fuse.search(query).map((res) => res.item);
      setSuggestions(fuzzyResults.slice(0, 8));
      setNotFound(fuzzyResults.length === 0);
    } catch (error) {
      console.error("Error fetching from TMDb:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputValue.trim().length >= 3) {
        fetchSuggestions(inputValue.trim());
      } else {
        setSuggestions([]);
        setNotFound(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setNotFound(false);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/search/${inputValue.trim()}`);
    }
  };

  return (
    <div className="SearchBody">
      <div className="CompleteBar">
        <div className="BAR">
          <input
            placeholder={placeholder}
            className="searchingbar"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        {notFound && inputValue.length >= 3 && (
          <div className="NotFound">
            No matching movies found for <strong>{inputValue}</strong>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="searchList">
            {suggestions.map((movie, index) => (
              <div
                key={index}
                className="searchItem"
                onClick={() => navigate(`/search/${movie.title}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-thumb"
                />
                <div className="movie-info">
                  <strong>{movie.title}</strong>{" "}
                  {movie.release_date && (
                    <span className="movie-year">
                      ({movie.release_date.slice(0, 4)})
                    </span>
                  )}
                  <div className="movie-rating">⭐ {movie.vote_average}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
