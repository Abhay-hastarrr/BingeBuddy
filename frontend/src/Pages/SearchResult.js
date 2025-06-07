import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Components/styles/SearchResultsStyles.css";
import MovieCard from "./Components/MovieCard";
import NavBar from "./Components/NavBar";
import ReactPlayer from "react-player";
import Footer from "./Components/Footer";


const SearchResult = () => {
    const { id: inputValue } = useParams();
    const apiKey = "api_key=8265bd1679663a7ea12ac168da84d2e8";
    const [searchedMovie, setSearchedMovie] = useState({});
    const [directorName, setDirectorName] = useState("");
    const [topCast, setTopCast] = useState([]);
    const [genres, setGenres] = useState([]);

    const [videoData, setVideoData] = useState(null);
    const [playTrailer, setPlayTrailer] = useState(false);
    const [loadingTrailer, setLoadingTrailer] = useState(false);

    const [byDirector, setByDirector] = useState([]);
    const [byGenre, setByGenre] = useState([]);
    const [byCast, setByCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);

    const imgLink = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchData = async () => {
            const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?${apiKey}&query=${inputValue}`);
            const searchData = await searchRes.json();
            const movie = searchData.results[0];
            if (!movie) return;

            setSearchedMovie(movie);

            const detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?${apiKey}&append_to_response=videos,credits,similar`);
            const detailsData = await detailsRes.json();

            const trailer = detailsData.videos?.results?.find(vid => vid.name.includes("Trailer")) || detailsData.videos?.results[0];
            setVideoData(trailer);

            setGenres(detailsData.genres.map(g => g.id));

            const topCastList = detailsData.credits.cast.slice(0, 5);
            setTopCast(topCastList);

            const director = detailsData.credits.crew.find(member => member.job === "Director");
            setDirectorName(director?.name || "");

            const simMovies = detailsData.similar?.results?.filter(m => m.id !== movie.id).slice(0, 7);
            setSimilarMovies(simMovies || []);

            fetchRecommendations(topCastList, director?.id, detailsData.genres.map(g => g.id), movie.id);
        };

        const fetchRecommendations = async (castList, directorId, genreIds, movieId) => {
            const castPromises = castList.map(c =>
                fetch(`https://api.themoviedb.org/3/person/${c.id}/movie_credits?${apiKey}`)
                    .then(res => res.json())
                    .then(data => data.cast.filter(m => m.id !== movieId))
            );
            const castMovies = (await Promise.all(castPromises)).flat();
            const uniqueCastMovies = getUniqueMovies(castMovies).slice(0, 7);
            setByCast(uniqueCastMovies);

            if (directorId) {
                const directorRes = await fetch(`https://api.themoviedb.org/3/person/${directorId}/movie_credits?${apiKey}`);
                const directorData = await directorRes.json();
                const directedMovies = directorData.crew.filter(m => m.job === "Director" && m.id !== movieId);
                const uniqueDirectorMovies = getUniqueMovies(directedMovies).slice(0, 7);
                setByDirector(uniqueDirectorMovies);
            }

            const genreMovieSet = new Set();
            const genrePromises = genreIds.map(id =>
                fetch(`https://api.themoviedb.org/3/discover/movie?${apiKey}&with_genres=${id}`)
                    .then(res => res.json())
                    .then(data => data.results.filter(m => m.id !== movieId))
            );
            const genreMovies = (await Promise.all(genrePromises)).flat();
            for (let m of genreMovies) genreMovieSet.add(JSON.stringify(m));
            const uniqueGenreMovies = Array.from(genreMovieSet).map(m => JSON.parse(m)).slice(0, 7);
            setByGenre(uniqueGenreMovies);
        };

        const getUniqueMovies = (movies) => {
            const seen = new Set();
            return movies.filter(m => {
                if (seen.has(m.id)) return false;
                seen.add(m.id);
                return true;
            });
        };

        fetchData();
    }, [inputValue]);

    const RenderMovies = (title, movies) => {
        if (!movies || movies.length === 0) return null;
        return (
            <div className="container-fluid recommendedMovies">
                <h2 className="container RecommendHeading">{title}</h2>
                <div className="container recommendedGrid">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        );
    };

    const RenderTrailer = () =>
        videoData ? (
            <>
                {loadingTrailer && (
                    <div className="trailer-loader">
                        <div className="spinner" />
                    </div>
                )}
                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${videoData.key}`}
                    playing
                    width="100%"
                    height="100%"
                    controls
                    className="youtube-container"
                    onReady={() => setLoadingTrailer(false)}
                />
            </>
        ) : null;

    return (
        <div
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)), url(${imgLink}${searchedMovie.backdrop_path})`
            }}
            className="MainBackGround"
        >
            <NavBar isHome={true} />
            <div className="container trailerContainer">
                {playTrailer && RenderTrailer()}
                <div className="container movie-details">
                    <div className="row">
                        <div className="col-md-6 left-box">
                            <h1 className="topTitle-Movie">{searchedMovie.title}</h1>
                           
                            <p className="overviewContent">{searchedMovie.overview}</p>

                            <p><b>Cast:</b></p>
                            <div className="casting">
                                {topCast.map(member =>
                                    member.profile_path ? (
                                        <a
                                            key={member.id}
                                            href={`https://en.wikipedia.org/wiki/${member.name}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={`${imgLink}${member.profile_path}`}
                                                alt={member.name}
                                                title={member.name}
                                            />
                                        </a>
                                    ) : null
                                )}
                            </div>

                            <p><b>Rating:</b> {searchedMovie.vote_average}/10</p>
                            <p><b>Release Date:</b> {searchedMovie.release_date}</p>
                            <p><b>Genres:</b> {searchedMovie.genre_ids?.join(", ")}</p>

                            <button className="trailer-bttn" onClick={() => {
                                setLoadingTrailer(true);
                                setPlayTrailer(true);
                            }}>
                                

                                <i className="fa-solid fa-play"></i> Watch Trailer
                            </button>
                        </div>
                        <div className="col-md-6 text-center">
                            <img
                                className="main-img"
                                src={`https://image.tmdb.org/t/p/w500${searchedMovie.poster_path}`}
                                alt={searchedMovie.title}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={playTrailer ? "DisplayOn" : "DisplayOFF"}>
                <button className="close-bttn" onClick={() => setPlayTrailer(false)}>
                    Close Trailer
                </button>
            </div>

            {RenderMovies("Top Recommend Movies", similarMovies)}
            {RenderMovies("Recommended by Genre", byGenre)}
            {RenderMovies("Recommended by Cast", byCast)}
            {RenderMovies("Recommended by Director", byDirector)}

            <Footer />
        </div>
    );
};

export default SearchResult;
