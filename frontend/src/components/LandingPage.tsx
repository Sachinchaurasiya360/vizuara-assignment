import React from "react";
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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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
                onClick={onGetStarted}
                className="bg-black hover:bg-slate-800 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2 transition-all"
              >
                Watch Demo
                <Sparkles className="ml-2 h-5 w-5" />
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
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-slate-50">
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
                onClick={onGetStarted}
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
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your First ML Model?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users building intelligent applications without
            code
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-black hover:bg-slate-100 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Workflow className="h-6 w-6 text-white" />
              <span className="text-white font-semibold">
                ML Pipeline Builder
              </span>
            </div>
            <div className="text-sm">
              Built with React, TypeScript, and TailwindCSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
