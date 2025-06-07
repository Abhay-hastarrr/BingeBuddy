import "./App.css";
import Home from "./Pages/Home";
import MovieHome from "./Pages/MovieHome"
import SearchResult from "./Pages/SearchResult";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Components/Login";
import Signup from "./Pages/Components/Signup";
import AboutUs from "./Pages/AboutUs";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<MovieHome />} />
                    <Route
                        exact
                        path="/search/:id"
                        element={<SearchResult />}
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<AboutUs />} />
                </Routes>
                

            </Router>
        </div>
    );
}

export default App;
