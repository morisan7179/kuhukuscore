import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import ProgressPage from "./ProgressPage";

export default function App() {
  return (
    <Router>
      <div style={{ padding: "10px" }}>
        <nav style={{ display: "flex", gap: "20px", fontSize: "4vw" }}>
          <Link to="/">🏠 記録ページ</Link>
          <Link to="/progress">📊 進捗ページ</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </div>
    </Router>
  );
}
