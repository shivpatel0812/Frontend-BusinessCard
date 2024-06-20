import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./styles.css";
import S3ImageDisplay from "./components/S3ImageDisplay";
import About from "./components/About";
import Shared from "./components/Shared";

function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>AI Business Card Analyzer</h1>
          <nav className="navbar">
            <Link to="/">Upload</Link>
            <Link to="/shared">Shared</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<S3ImageDisplay />} />
            <Route path="/shared" element={<Shared />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
