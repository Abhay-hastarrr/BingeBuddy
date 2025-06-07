import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";

const API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const TMDB_TOP_RATED_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

const TopRatedMovies = () => {
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await axios.get(TMDB_TOP_RATED_URL);
        setTopRated(response.data.results);
      } catch (err) {
        console.error("Failed to fetch top rated movies", err);
      }
    };
    fetchTopRated();
  }, []);

  return (
    <div className="my-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Top Rated Movies</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {topRated.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default TopRatedMovies;
