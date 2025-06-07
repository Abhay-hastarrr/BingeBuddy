import React from "react";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <NavBar isHome={true} />

      {/* Content */}
      <div className="flex-grow px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-red-500">About Us</h1>
        <p className="text-lg mb-4">
          Welcome to <strong>BingeBuddy</strong> — your ultimate movie recommendation hub! 🚀
        </p>
        <p className="mb-4">
          Our mission is to help movie lovers discover great content. Whether you're into the latest blockbusters,
          indie gems, or hidden classics, we've got you covered.
        </p>
        <p className="mb-4">
          This platform is built using modern technologies like React, Node.js, and the TMDb API. We also
          leverage AI to provide personalized recommendations based on your preferences.
        </p>
        <p>
          If you have any feedback or suggestions, don’t hesitate to reach out. We're always improving!
        </p>
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default AboutUs;
