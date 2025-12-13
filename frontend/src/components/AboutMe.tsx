import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Linkedin,
  Github,
  Globe,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

export function AboutMe() {
  const navigate = useNavigate();

  const skills = {
    languages: ["JavaScript", "TypeScript", "Python"],
    backend: [
      "Node.js",
      "Express",
      "FastAPI",
      "Prisma",
      "Zod",
      "WebSockets",
      "WebRTC",
      "Redis",
      "Kafka",
    ],
    frontend: ["React.js", "Next.js", "Tailwind CSS", "Shadcn", "Context API"],
    devops: ["Docker", "AWS (EC2, S3, CDN)", "CI/CD"],
    database: ["MongoDB", "PostgreSQL", "SQL"],
  };

  const experience = [
    {
      title: "Full Stack Developer Intern",
      company: "Aaradhay Tech",
      period: "June 2024 – Aug 2024",
      description:
        "Improved platform performance and built scalable full-stack solutions for event management system.",
      achievements: [
        "Improved platform performance by ~35% by refactoring backend services, shifting inter-service communication to gRPC, and restructuring MongoDB queries with proper indexing",
        "Built consistent and accessible UI components using React and Tailwind, reducing rendering issues and ensuring smooth workflows across role-based dashboards",
        "Optimized event creation, team formation, and submission pipelines using Redis caching and Express API restructuring, resulting in nearly 50% faster user interactions",
      ],
    },
  ];

  const projects = [
    {
      name: "CourseFlow",
      description:
        "Scalable course-selling platform with SFU architecture for real-time interactive teaching sessions, supporting students, instructors, and admins with complete authentication, payments, and content delivery",
      tech: ["React.js", "Node.js", "TypeScript", "MongoDB", "WebRTC", "SFU"],
      link: "https://github.com/Sachinchaurasiya360/CourseFlow",
    },
    {
      name: "InternHack",
      description:
        "Full-stack platform for job discovery and hackathons with role-based dashboards, OpenAI-powered resume analysis, and peer-to-peer interview architecture for real-time technical interviews",
      tech: [
        "Next.js",
        "PostgreSQL",
        "Node.js",
        "TypeScript",
        "Shadcn",
        "OpenAI",
      ],
      link: "https://github.com/Sachinchaurasiya360/internhack",
    },
    {
      name: "MediTrack",
      description:
        "Healthcare platform for clinics to manage appointments, EMR, and billing with secure multi-tenant backend, audit logging, and real-time telemedicine",
      tech: ["FastAPI", "SQL", "Redis", "React.js"],
      link: "https://github.com/Sachinchaurasiya360/MediTrack",
    },
  ];

  const education = [
    {
      degree: "B.Tech in Computer Science Engineering",
      institution: "University of Mumbai",
      period: "2022 – 2026",
      location: "Mumbai, India",
    },
  ];

  const achievements = [
    "Winner — Vision Project Exhibition (2023–2025) in Python, Cybersecurity, and MERN",
    "Technical Secretary; Hackathon Club Lead; Head, Training & Placement Cell — Vishwaniketan iMEET",
    "Lead Organizer — 'Hack to Crack 1.0' and 'Hack to Crack 2.0'",
    "Mentor — Smart India Hackathon and Code Autometa",
    "Freelancer — delivered 10+ full-stack projects",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-black">About Me</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-32 h-26 bg-black rounded-xl flex items-center justify-center text-white text-4xl font-bold shrink-0">
              <img src="/IMG-20250924-WA0125.jpg" alt="Profile Pic"
              
              className="rounded-xl"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-black mb-2">
                Sachin Chaurasiya
              </h2>
              <p className="text-xl text-slate-600 mb-4">
                Full Stack Developer 
              </p>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Computer Science AI/ML student specializing in full-stack development
                with strong experience in building scalable systems and
                real-time applications. Focused on engineering impactful
                products with clean architecture and performance-oriented
                design.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open("mailto:mrsachinchaurasiya@gmail.com", "_blank")
                  }
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/sachinchaurasiya",
                      "_blank"
                    )
                  }
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open(
                      "https://github.com/Sachinchaurasiya360",
                      "_blank"
                    )
                  }
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open("https://sachinchaurasiya.vercel.app/", "_blank")
                  }
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-6 w-6 text-black" />
            <h3 className="text-2xl font-bold text-black">Technical Skills</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.languages.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Backend</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.backend.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Frontend</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.frontend.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>DevOps & Cloud</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.devops.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Database</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.database.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="h-6 w-6 text-black" />
            <h3 className="text-2xl font-bold text-black">Work Experience</h3>
          </div>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-xl">{exp.title}</CardTitle>
                      <p className="text-lg text-slate-700 mt-1">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {exp.period}
                    </span>
                  </div>
                  <CardDescription>
                    <p className="text-slate-700 mb-3">{exp.description}</p>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-slate-600"
                        >
                          <span className="text-black mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-6 w-6 text-black" />
            <h3 className="text-2xl font-bold text-black">Featured Projects</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </div>
                  <CardDescription>
                    <p className="text-slate-700 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Education */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="h-6 w-6 text-black" />
              <h3 className="text-2xl font-bold text-black">Education</h3>
            </div>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{edu.degree}</CardTitle>
                    <CardDescription>
                      <p className="text-slate-700 mt-1">{edu.institution}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-slate-600">
                          {edu.period}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {edu.location}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-black" />
              <h3 className="text-2xl font-bold text-black">
                Achievements & Leadership
              </h3>
            </div>
            <Card>
              <CardHeader>
                <CardDescription>
                  <ul className="space-y-3">
                    {achievements.map((achievement, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-700"
                      >
                        <div className="w-2 h-2 bg-black rounded-full mt-2 shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardDescription>
              </CardHeader>
            </Card>
          </section>
        </div>

        {/* Call to Action */}
        <section className="bg-black text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Let's Work Together</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and
            opportunities. Whether you have a question or just want to say hi,
            feel free to reach out!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-slate-100 border-white"
              onClick={() =>
                window.open("mailto:mrsachinchaurasiya@gmail.com", "_blank")
              }
            >
              <Mail className="h-4 w-4 mr-2" />
              Get In Touch
            </Button>
            <Button
              variant="outline"
              className="bg-transparent text-white hover:bg-white hover:text-black border-white"
              onClick={() => navigate("/builder")}
            >
              View ML Pipeline Demo
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600">
            © 2025 Sachin Chaurasiya. Built with React, TypeScript, and
            TailwindCSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
