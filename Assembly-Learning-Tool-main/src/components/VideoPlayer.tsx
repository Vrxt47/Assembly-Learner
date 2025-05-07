"use client"

import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useRef } from "react"

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assembly Language Video Tutorials</h1>
        <p className="text-gray-600 text-lg mb-4">
          Watch detailed explanations with practical examples to master assembly programming
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
            {/* Using the local video file with the correct path */}
            <video
              ref={videoRef}
              className="w-full h-[500px] object-contain bg-black"
              controls
              controlsList="nodownload"
            >
              {/* Use the correct path to the video file in the project root */}
              <source src="/final.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h2 className="text-2xl font-bold mb-4">Introduction to Assembly Language</h2>
          <p className="text-gray-600 mb-6">
            This comprehensive video tutorial covers all the fundamentals of assembly language programming. Learn about
            registers, memory addressing, basic instructions, and how to write your first assembly program.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Video Contents</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mr-3">
                  1
                </span>
                <span>Introduction to Assembly Language (00:00 - 05:30)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mr-3">
                  2
                </span>
                <span>CPU Architecture and Registers (05:31 - 12:45)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mr-3">
                  3
                </span>
                <span>Memory Addressing Modes (12:46 - 18:20)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mr-3">
                  4
                </span>
                <span>Basic Assembly Instructions (18:21 - 25:10)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mr-3">
                  5
                </span>
                <span>Writing Your First Assembly Program (25:11 - 35:00)</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              to="/tutorial"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Written Tutorials
            </Link>
            <Link
              to="/playground"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try It Yourself
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
