"use client"

import { useState, useRef } from "react"
import { ChevronRight, Play, Clock, BookIcon, X, Video, FileText, Code } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import "./Tutorial.css"

const tutorials = [
  {
    id: 1,
    title: "Introduction to Assembly",
    description: "Learn the basics of assembly language programming",
    duration: "30 min",
    level: "Beginner",
    topics: [
      "What is Assembly Language?",
      "Basic Structure and Syntax",
      "Setting up Development Environment",
      "Writing Your First Program",
    ],
    videoUrl: "/tutorial-videos/intro-assembly.mp4",
  },
  {
    id: 2,
    title: "Registers and Memory",
    description: "Understanding CPU registers and memory management",
    duration: "45 min",
    level: "Beginner",
    topics: [
      "CPU Registers Overview",
      "Memory Addressing Modes",
      "Stack and Heap Memory",
      "Memory Management Best Practices",
    ],
    videoUrl: "/tutorial-videos/registers-memory.mp4",
  },
  {
    id: 3,
    title: "Basic Instructions",
    description: "Common assembly instructions and their usage",
    duration: "60 min",
    level: "Intermediate",
    topics: [
      "Data Movement Instructions",
      "Arithmetic Operations",
      "Control Flow Instructions",
      "System Calls and Interrupts",
    ],
    videoUrl: "/tutorial-videos/basic-instructions.mp4",
  },
]

function Tutorial() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [showTutorialModal, setShowTutorialModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const tutorialSectionRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const scrollToTutorials = () => {
    setSelectedOption("tutorials")
    tutorialSectionRef.current?.scrollIntoView({ behavior: "smooth" })
    setShowTutorialModal(false)
  }

  const openVideoPlayer = (videoId = 1) => {
    setSelectedOption("video")
    // Navigate to the structured learning video player
    navigate(`/structured-learning/final`)
    setShowTutorialModal(false)
  }

  const handlePlayVideo = (id: number) => {
    setActiveVideo(id)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Enhanced Tutorial Welcome Banner with animated elements */}
      <div className="welcome-banner bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-12">
        <div className="p-8 md:p-12 text-white relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn hero-title">Master Assembly Language</h1>
            <p className="text-xl md:text-2xl mb-8 animate-fadeIn animation-delay-200 max-w-3xl mx-auto">
              Comprehensive tutorials to help you understand low-level programming from the ground up. Dive into the
              world of registers, memory, and CPU instructions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn animation-delay-400"></div>
          </div>

          {/* Animated code elements */}
          <div className="code-particles">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="code-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
              >
                {["MOV", "ADD", "SUB", "JMP", "CMP", "INT"][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature highlights section */}
      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="feature-card">
          <div className="feature-icon">
            <BookIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Structured Learning</h3>
          <p className="text-gray-600">
            <Link to="/tutorial" className="text-indigo-600 hover:underline">
              Step-by-step tutorials designed for beginners to advanced programmers
            </Link>
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <Video className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Video Tutorials</h3>
          <p className="text-gray-600">
            <Link to="/structured-learning/final" className="text-indigo-600 hover:underline">
              Watch detailed explanations with practical examples
            </Link>
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <Code className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Interactive Playground</h3>
          <p className="text-gray-600">
            <Link to="/playground" className="text-indigo-600 hover:underline">
              Practice assembly code in our browser-based environment
            </Link>
          </p>
        </div>
      </div>

      {/* Tutorial Modal with improved styling and functionality */}
      {showTutorialModal && (
        <div className="tutorial-modal-overlay">
          <div className="tutorial-modal">
            <button className="modal-close-btn" onClick={() => setShowTutorialModal(false)}>
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">How would you like to learn?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="learning-option" onClick={() => navigate("/structured-learning/final")}>
                <Video className="h-12 w-12 mb-4 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-2">Learn from videos</h3>
                <p className="text-gray-600">Watch our comprehensive video tutorials</p>
              </div>
              <div className="learning-option" onClick={scrollToTutorials}>
                <FileText className="h-12 w-12 mb-4 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-2">Start reading tutorials</h3>
                <p className="text-gray-600">Dive into our written tutorials</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial listing section with ref for scrolling */}
      <div ref={tutorialSectionRef}>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Assembly Language Tutorials</h2>
        <div className="grid grid-cols-1 gap-8">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="tutorial-card bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-semibold text-gray-900">{tutorial.title}</h3>
                      <span className="level-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {tutorial.level}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-lg">{tutorial.description}</p>

                    <div className="flex items-center gap-4 mb-6">
                      <span className="inline-flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-1" />
                        {tutorial.duration}
                      </span>
                      <span className="inline-flex items-center text-gray-600">
                        <BookIcon className="h-5 w-5 mr-1" />
                        {tutorial.topics.length} topics
                      </span>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-2">Topics Covered:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tutorial.topics.map((topic, index) => (
                          <li key={index} className="topic-item flex items-center text-gray-700">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-4">
                      <Link
                        to={`/tutorial/${tutorial.id}`}
                        className="button-primary inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Start Learning
                        <ChevronRight className="h-5 w-5 ml-1" />
                      </Link>
                      
                    </div>
                  </div>

                  {/* Video preview container */}
                  <div
                    className={`video-container lg:w-1/2 rounded-lg overflow-hidden ${activeVideo === tutorial.id ? "active" : ""}`}
                  >
                    {activeVideo === tutorial.id && (
                      <div className="relative pt-[56.25%]">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                          src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`} // Placeholder - replace with actual video
                          title={tutorial.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action section */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to become an Assembly expert?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who have mastered low-level programming with our comprehensive tutorials.
        </p>
        <Link
          to="/playground"
          className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all inline-flex items-center"
        >
          Try the Assembly Playground
          <ChevronRight className="h-5 w-5 ml-1" />
        </Link>
      </div>
    </div>
  )
}

export default Tutorial
