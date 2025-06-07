import { useNavigate } from "react-router-dom";


const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const img_path = "https://image.tmdb.org/t/p/w500";

  const goToMovie = () => {
    navigate(`/search/${movie.title}`);
  };

  return (
    <div className="w-48 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300 relative">
      <div onClick={goToMovie} className="cursor-pointer">
        {movie.poster_path && (
          <img
            src={img_path + movie.poster_path}
            alt={movie.title}
            title={movie.title}
            className="w-full h-72 object-cover"
          />
        )}

        {/* Rating badge */}
        {movie.vote_average && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-sm font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            {movie.vote_average.toFixed(1)}
            <i className="fa fa-star text-yellow-400" aria-hidden="true"></i>
          </div>
        )}
      </div>

     

      {/* Movie Title */}
      <div className="text-sm text-white text-center font-semibold py-2 px-1 truncate">
        {movie.title}
      </div>
    </div>
  );
};

export default MovieCard;
