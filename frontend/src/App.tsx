import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LandingPage } from "./components/LandingPage";
import { PipelineBuilder } from "./components/PipelineBuilder";
import { AboutMe } from "./components/AboutMe";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<PipelineBuilder />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
