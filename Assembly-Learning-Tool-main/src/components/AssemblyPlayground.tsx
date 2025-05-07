"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Play, RotateCcw } from "lucide-react"

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://assembly-learning-platform-40e9yvh7f.vercel.app/api'
    : '/api',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
})

function AssemblyPlayground() {
  const [code, setCode] = useState(`section .data
    msg db "Hello, World!", 0

section .text
    global _start
_start:
    mov eax, 4      ; System call to print
    mov ebx, 1      ; File descriptor (stdout)
    mov ecx, msg    ; Message to print
    mov edx, 13     ; Length of message
    int 0x80        ; Call kernel
    
    mov eax, 1      ; System call to exit
    xor ebx, ebx    ; Exit code 0
    int 0x80`)
  const [output, setOutput] = useState("Output will appear here...")
  const [status, setStatus] = useState("Ready")
  const [isLoading, setIsLoading] = useState(false)

  // Function to check if server is running
  const checkServerConnection = async () => {
    try {
      console.log("Checking server connection...");
      const response = await api.get("/");
      console.log("Server connection response:", response.data);
      setStatus("Connected to server");
    } catch (err) {
      console.error("Server connection test failed:", err);
      setStatus("Cannot connect to server. Please try again later.");
    }
  }

  // Check server connection on component mount
  useEffect(() => {
    checkServerConnection();
  }, []);

  const handleCompile = async () => {
    if (!code.trim()) {
      setOutput("Please enter some code to compile");
      setStatus("Error");
      return;
    }

    setStatus("Compiling...");
    setOutput("");
    setIsLoading(true);

    try {
      console.log("Making API request to:", api.defaults.baseURL);
      console.log("Sending code to server:", code.substring(0, 100) + "...");
      
      const response = await api.post("/execute", {
        script: code,
        stdin: "",
      });

      console.log("Server response:", response);

      if (response.data.output) {
        setOutput(response.data.output);
        setStatus("Execution completed");
      } else if (response.data.error) {
        setOutput(`Error: ${response.data.error}`);
        setStatus("Error occurred");
      } else {
        setOutput("No output received from server");
        setStatus("Error occurred");
      }
    } catch (err) {
      console.error("Compilation error:", err);
      let errorMessage = "An error occurred";

      if (axios.isAxiosError(err)) {
        if (err.code === "ERR_NETWORK") {
          errorMessage = "Network error. Please check if any extensions are blocking the request.";
        } else if (err.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Server may be overloaded or unreachable.";
        } else if (err.response) {
          errorMessage = `Server error: ${err.response.status} - ${err.response.data?.error || err.message}`;
        } else if (err.request) {
          errorMessage = "No response received from server. Please check your connection and any ad blockers.";
        } else {
          errorMessage = `Request error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setOutput(`Error: ${errorMessage}`);
      setStatus("Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  }

  const handleClear = () => {
    setCode("")
    setOutput("")
    setStatus("Editor cleared")
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assembly Playground</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Code</h2>
          <textarea
            className="w-full p-4 font-mono text-sm bg-gray-50 border rounded-md"
            style={{ height: "32rem" }}
            placeholder="Enter your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleClear}
              className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </button>

            <button
              onClick={handleCompile}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? "Compiling..." : "Compile & Run"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Output</h2>
          <div className="bg-gray-50 p-4 rounded-md border h-64 overflow-y-auto font-mono text-sm">{output}</div>

          <div className="mt-4 text-sm font-medium">
            Status:{" "}
            <span
              className={`${status.includes("Error") || status.includes("Failed") ? "text-red-500" : "text-blue-600"}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">How to use the Assembly Playground:</h3>
        <ol className="list-decimal ml-5 space-y-1 text-sm">
          <li>Write your x86 assembly code in the editor</li>
          <li>Click "Compile & Run" to execute your code</li>
          <li>View the output in the right panel</li>
          <li>Use "Clear" to reset the editor</li>
        </ol>
      </div>
    </div>
  )
}

export default AssemblyPlayground
