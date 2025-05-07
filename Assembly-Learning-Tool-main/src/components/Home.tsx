import { BookOpen, Code, Video, ChevronRight, Clock, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  
  const featuredTutorials = [
    {
      id: 1,
      title: "Introduction to Assembly",
      description: "Learn the basics of assembly language programming",
      duration: "30 min",
      level: "Beginner",
    },
    {
      id: 2,
      title: "Registers and Memory",
      description: "Understanding CPU registers and memory management",
      duration: "45 min",
      level: "Beginner",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to AssemblyHub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your comprehensive resource for learning assembly language programming with interactive tutorials and tools.
        </p>
      </div>

      {/* Interactive Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            id: 1,
            icon: <Video className="h-12 w-12 text-indigo-600 mx-auto mb-4" />,
            title: "Video Tutorials",
            description: "Watch detailed explanations with practical examples",
            link: "/structured-learning/final",
            linkText: "Watch Videos"
          },
          {
            id: 2,
            icon: <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />,
            title: "Step-by-step Tutorials",
            description: "Comprehensive tutorials for all skill levels",
            link: "/tutorial",
            linkText: "Start Learning"
          },
          {
            id: 3,
            icon: <Code className="h-12 w-12 text-indigo-600 mx-auto mb-4" />,
            title: "Interactive Playground",
            description: "Practice assembly code in our browser-based environment",
            link: "/playground",
            linkText: "Start Coding"
          }
        ].map((card) => (
          <div 
            key={card.id}
            className={`bg-white p-8 rounded-xl shadow-lg transition-all duration-300 ${hoveredCard === card.id ? 'transform -translate-y-2 shadow-xl' : ''}`}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {card.icon}
            <h2 className="text-2xl font-semibold mb-4 text-center">{card.title}</h2>
            <p className="text-gray-600 mb-6 text-center">{card.description}</p>
            <div className="text-center">
              <Link
                to={card.link}
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {card.linkText}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Tutorials Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredTutorials.map((tutorial) => (
            <div key={tutorial.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{tutorial.title}</h3>
                  <p className="text-gray-600 mb-3">{tutorial.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-4">{tutorial.duration}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {tutorial.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            to="/tutorial" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View all tutorials <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to start your assembly journey?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of developers learning assembly language with our interactive platform.
        </p>
        <Link
          to="/tutorial"
          className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Get Started Now <ChevronRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    </div>
  )
}

export default Home
