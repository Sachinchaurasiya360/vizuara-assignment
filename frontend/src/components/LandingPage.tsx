import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Workflow,
  Upload,
  Brain,
  BarChart3,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { usePipelineStore } from "../store/usePipelineStore";

export function LandingPage() {
  const navigate = useNavigate();
  const { resetPipeline } = usePipelineStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleGetStarted = () => {
    resetPipeline();
    navigate("/builder");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="p-1.5 bg-black rounded-lg">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">
                ML Pipeline Builder
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-600 hover:text-black transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-slate-600 hover:text-black transition-colors font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => navigate("/about")}
                className="text-slate-600 hover:text-black transition-colors font-medium"
              >
                About Developer
              </button>
              <Button
                onClick={handleGetStarted}
                className="bg-black hover:bg-slate-800 text-white"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-slate-600 hover:text-black transition-colors font-medium text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-slate-600 hover:text-black transition-colors font-medium text-left"
                >
                  How It Works
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="text-slate-600 hover:text-black transition-colors font-medium text-left"
                >
                  About
                </button>
                <Button
                  onClick={handleGetStarted}
                  className="bg-black hover:bg-slate-800 text-white w-full"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black mb-8 shadow-lg">
              <Workflow className="h-10 w-10 text-white" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Build ML Pipelines
              <span className="block text-black mt-2">
                Without Writing Code
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Create, train, and deploy machine learning models with our
              intuitive visual pipeline builder. No coding required, just drag,
              drop, and deploy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-black hover:bg-slate-800 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-black">10+</div>
                <div className="text-sm text-slate-600">ML Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">5 Steps</div>
                <div className="text-sm text-slate-600">To Deploy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">100%</div>
                <div className="text-sm text-slate-600">No Code</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Build ML Models
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features that make machine learning accessible to
              everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-black hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-black" />
                </div>
                <CardTitle>Easy Data Upload</CardTitle>
                <CardDescription>
                  Drag and drop your CSV, Excel, or JSON files. Automatic data
                  validation and preview.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-black hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <CardTitle>Smart Preprocessing</CardTitle>
                <CardDescription>
                  Automated data cleaning, scaling, and encoding. Handle missing
                  values with one click.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-black hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-black" />
                </div>
                <CardTitle>Multiple Models</CardTitle>
                <CardDescription>
                  Choose from 16+ algorithms including Random Forest, Neural
                  Networks, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 hover:border-black hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-black" />
                </div>
                <CardTitle>Visual Analytics</CardTitle>
                <CardDescription>
                  Beautiful charts and metrics. Confusion matrix, feature
                  importance, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 hover:border-black hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-black" />
                </div>
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Export trained models and predictions. Deploy with confidence
                  using best practices.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 hover:border-black hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <CardTitle>For Everyone</CardTitle>
                <CardDescription>
                  Designed for beginners and experts alike. No machine learning
                  knowledge required.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Build your ML pipeline in 5 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Add your dataset",
                icon: Upload,
                color: "blue",
              },
              {
                step: "2",
                title: "Preprocess",
                desc: "Clean your data",
                icon: Zap,
                color: "indigo",
              },
              {
                step: "3",
                title: "Split",
                desc: "Train/test split",
                icon: Workflow,
                color: "purple",
              },
              {
                step: "4",
                title: "Train",
                desc: "Select a model",
                icon: Brain,
                color: "pink",
              },
              {
                step: "5",
                title: "Deploy",
                desc: "Get results",
                icon: BarChart3,
                color: "green",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 4 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-300 -z-10" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-black flex items-center justify-center mb-4 shadow-lg">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="font-bold text-lg mb-2">{item.title}</div>
                  <div className="text-sm text-slate-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <div className="space-y-4">
                {[
                  "No coding required - visual interface",
                  "Automatic hyperparameter tuning",
                  "Real-time model performance metrics",
                  "Export predictions in multiple formats",
                  "Support for classification & regression",
                  "Built-in data preprocessing tools",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-black shrink-0 mt-0.5" />
                    <span className="text-lg text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="mt-8 bg-black hover:bg-slate-800"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-slate-200 rounded-2xl transform rotate-3 opacity-20" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-100">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                  <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Workflow className="h-16 w-16 text-slate-400 opacity-50" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-slate-100 rounded animate-pulse" />
                    <div className="h-16 bg-slate-100 rounded animate-pulse" />
                    <div className="h-16 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Text Content */}
              <div className="p-12 flex flex-col justify-center">
                <div className="inline-block px-4 py-2 bg-slate-100 rounded-full text-slate-900 text-sm font-medium mb-6 w-fit">
                  🚀 Start Building Today
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Ready to Build Your First ML Model?
                </h2>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Join thousands of developers and data scientists building
                  powerful ML models without writing code.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-black hover:bg-slate-800 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all group"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/about")}
                    className="border-2 border-slate-300 hover:border-black px-8 py-6 text-lg transition-all"
                  >
                    Learn More About Me
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-200">
                  <div>
                    <div className="text-2xl font-bold text-black">1000+</div>
                    <div className="text-sm text-slate-600">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-black">50K+</div>
                    <div className="text-sm text-slate-600">Models Trained</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-black">98%</div>
                    <div className="text-sm text-slate-600">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual Element */}
              <div className="bg-slate-50 p-12 flex items-center justify-center border-l border-slate-200">
                <div className="w-full max-w-md space-y-4">
                  {/* Mock Pipeline Steps */}
                  {[
                    { icon: Upload, label: "Upload Data", step: 1 },
                    { icon: Brain, label: "Preprocess", step: 2 },
                    { icon: Zap, label: "Train Model", step: 3 },
                    { icon: BarChart3, label: "View Results", step: 4 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white p-4 rounded-lg border-2 border-slate-200 hover:border-black hover:shadow-md transition-all"
                    >
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 font-semibold">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          Step {item.step}
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-black rounded-lg">
                  <Workflow className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">
                  ML Pipeline Builder
                </span>
              </div>
              <p className="text-slate-600 mb-6 max-w-md">
                Build, train, and deploy machine learning models without writing
                code. The fastest way to turn your data into intelligence.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-100 hover:bg-black hover:text-white rounded-lg flex items-center justify-center text-slate-700 transition-all border border-slate-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-100 hover:bg-black hover:text-white rounded-lg flex items-center justify-center text-slate-700 transition-all border border-slate-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-100 hover:bg-black hover:text-white rounded-lg flex items-center justify-center text-slate-700 transition-all border border-slate-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-black font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/builder")}
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    Pipeline Builder
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    About Me
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-black font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-black transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-200 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-600 text-sm">
                © 2025 ML Pipeline Builder. Built with React, TypeScript, and
                TailwindCSS.
              </p>
              <div className="flex gap-6 text-sm">
                <a
                  href="#"
                  className="text-slate-600 hover:text-black transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-black transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-black transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
