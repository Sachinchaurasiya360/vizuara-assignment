import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LandingPage } from "./components/LandingPage";
import { PipelineBuilder } from "./components/PipelineBuilder";
import { AboutMe } from "./components/AboutMe";
import { ModelEvaluationPage } from "./modules/model-evaluation/pages/ModelEvaluationPage";
import { WorkflowBuilderPage } from "./modules/workflow-builder/pages/WorkflowBuilderPage";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<PipelineBuilder />} />
        <Route path="/workflow-builder" element={<WorkflowBuilderPage />} />
        <Route path="/model-evaluation" element={<ModelEvaluationPage />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
