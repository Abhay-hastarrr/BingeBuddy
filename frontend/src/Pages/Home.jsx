import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./Components/NavBar";
import PopularMovies from "./Components/PopularMovies";
import TopRatedMovies from "./Components/TopRatedMovies";
import "./Components/styles/Home.css";
import Footer from "./Components/Footer";
import UpcomingMovies from "./Components/UpcomingMovies";

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="bg-black">
        <div className="hero-banner bg-dark text-white">
          <div className="hero-content container">
            <div className="brand-title animated-brand mb-3">BingeBuddy!</div>
            <p className="lead">Skip the Search, Start Watching!</p>
            <Link to="/movies" className="btn btn-danger btn-lg mt-3 bouncy">
              Explore Now
            </Link>
          </div>
        </div>

        <PopularMovies />
        <TopRatedMovies />
        <UpcomingMovies />
      </div>
      <Footer />
    </>
  );
};

export default Home;
