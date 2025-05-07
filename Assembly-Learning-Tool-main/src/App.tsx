import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { BookOpen, Code, HomeIcon, Cpu } from "lucide-react"
import Tutorial from "./components/Tutorial"
import TutorialDetail from "./components/TutorialDetail"
import AssemblyPlayground from "./components/AssemblyPlayground"
import Home from "./components/Home"
import VideoPlayer from "./components/VideoPlayer"
import Simulator from "./components/Simulator"

// No need to import the video file directly

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center">
                  <Code className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-800">AssemblyHub</span>
                </Link>
              </div>
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <HomeIcon className="h-5 w-5 mr-1" />
                  Home
                </Link>
                <Link
                  to="/tutorial"
                  className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <BookOpen className="h-5 w-5 mr-1" />
                  Tutorial
                </Link>
                <Link
                  to="/playground"
                  className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Code className="h-5 w-5 mr-1" />
                  Playground
                </Link>
                <Link
                  to="/simulator"
                  className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Cpu className="h-5 w-5 mr-1" />
                  Simulator
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/tutorial/:id" element={<TutorialDetail />} />
            <Route path="/playground" element={<AssemblyPlayground />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/structured-learning/final" element={<VideoPlayer />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <Link to="/" className="flex items-center">
                  <Code className="h-6 w-6 text-indigo-600" />
                  <span className="ml-2 text-lg font-bold text-gray-800">AssemblyHub</span>
                </Link>
                <p className="mt-2 text-sm text-gray-600">
                  Your comprehensive resource for learning assembly language programming.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Learn</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <Link to="/tutorial" className="text-gray-600 hover:text-indigo-600">
                        Tutorials
                      </Link>
                    </li>
                    <li>
                      <Link to="/playground" className="text-gray-600 hover:text-indigo-600">
                        Playground
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase"></h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <a href="#" className="text-gray-600 hover:text-indigo-600">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-indigo-600">
                        
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <a href="#" className="text-gray-600 hover:text-indigo-600">
                        
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/in/harsh-378b412b6/" className="text-gray-600 hover:text-indigo-600">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 text-center">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} AssemblyHub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
