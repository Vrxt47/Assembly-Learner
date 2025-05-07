"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ChevronRight, Download, BookOpen } from "lucide-react"
import html2pdf from "html2pdf.js"

interface Tutorial {
  id: string
  title: string
  description: string
  content: string
  videoUrl?: string
}

function TutorialDetail() {
  const { id } = useParams()
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [tableOfContents, setTableOfContents] = useState<{ id: string; title: string; level: number }[]>([])
  const [activeTab, setActiveTab] = useState<"content" | "video">("content")

  const handleDownloadPDF = () => {
    if (!tutorial) return

    const element = document.createElement("div")
    element.innerHTML = `
    <h1 style="font-size: 24px; margin-bottom: 20px;">${tutorial.title}</h1>
    <p style="margin-bottom: 30px; color: #666;">${tutorial.description}</p>
    ${tutorial.content.replace(/class="[^"]*"/g, "").replace(/<pre/g, '<pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto;"')}
  `

    // Format date for filename
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().split("T")[0] // YYYY-MM-DD format

    // PDF options with better organized filename
    const opt = {
      margin: 10,
      filename: `AssemblyHub_${tutorial.title.replace(/\s+/g, "_")}_${formattedDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }

    // Show download status to user
    const downloadStatus = document.createElement("div")
    downloadStatus.style.position = "fixed"
    downloadStatus.style.top = "20px"
    downloadStatus.style.right = "20px"
    downloadStatus.style.padding = "15px 20px"
    downloadStatus.style.backgroundColor = "rgba(59, 130, 246, 0.9)"
    downloadStatus.style.color = "white"
    downloadStatus.style.borderRadius = "5px"
    downloadStatus.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
    downloadStatus.style.zIndex = "9999"
    downloadStatus.style.transition = "opacity 0.3s"
    downloadStatus.textContent = "Preparing PDF for download..."
    document.body.appendChild(downloadStatus)

    // Generate and download PDF
    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        // Update status message
        downloadStatus.style.backgroundColor = "rgba(16, 185, 129, 0.9)"
        downloadStatus.textContent = `PDF downloaded as ${opt.filename}`

        // Remove status message after 3 seconds
        setTimeout(() => {
          downloadStatus.style.opacity = "0"
          setTimeout(() => document.body.removeChild(downloadStatus), 300)
        }, 3000)
      })
      .catch((error: Error) => {
        console.error("PDF download error:", error)
        downloadStatus.style.backgroundColor = "rgba(239, 68, 68, 0.9)"
        downloadStatus.textContent = "Error downloading PDF. Please try again."

        setTimeout(() => {
          downloadStatus.style.opacity = "0"
          setTimeout(() => document.body.removeChild(downloadStatus), 300)
        }, 3000)
      })
  }

  useEffect(() => {
    if (id === "1") {
      setTutorial({
        id: "1",
        title: "Introduction to Assembly (Beginner-Friendly)",
        description: "Learn what assembly language is and why it matters.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder - replace with actual video
        content: `
          <h2 id="goal" class="text-xl font-semibold mb-3 cursor-pointer hover:text-blue-600 transition-colors">📌 Goal</h2>
          <div class="mb-6 pl-4 border-l-4 border-blue-200">
            <p>Help learners understand what assembly language is and why it matters.</p>
          </div>
          
          <h2 id="concepts" class="text-xl font-semibold mb-3 cursor-pointer hover:text-blue-600 transition-colors">🎯 Key Concepts to Cover</h2>
          
          <h3 id="what-is-assembly" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">What is Assembly Language?</h3>
          <ul class="list-disc ml-6 mb-6 space-y-2">
            <li class="hover:bg-blue-50 p-1 rounded">It's a low-level language that directly communicates with the CPU.</li>
            <li class="hover:bg-blue-50 p-1 rounded">It is faster and more efficient than high-level languages (Python, C, etc.).</li>
            <li class="hover:bg-blue-50 p-1 rounded">Every processor has its own assembly language (e.g., x86, ARM, RISC-V).</li>
          </ul>

          <h3 id="why-learn" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">Why Learn Assembly?</h3>
          <ul class="list-disc ml-6 mb-6 space-y-2">
            <li class="hover:bg-blue-50 p-1 rounded">✅ Helps you understand how computers really work.</li>
            <li class="hover:bg-blue-50 p-1 rounded">✅ Useful in OS development, cybersecurity, and embedded systems.</li>
            <li class="hover:bg-blue-50 p-1 rounded">✅ Gives better performance control than high-level languages.</li>
          </ul>

          <h3 id="basic-structure" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">Basic Structure of an Assembly Program</h3>
          <div class="mb-6 relative group">
            <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>
section .data
    msg db "Hello, World!", 0

section .text
    global _start
_start:
    mov eax, 4    ; System call to print
    mov ebx, 1    ; File descriptor (stdout)
    mov ecx, msg  ; Message to print
    mov edx, 13   ; Length of message
    int 0x80      ; Call kernel

    mov eax, 1    ; System call to exit
    xor ebx, ebx  ; Exit code 0
    int 0x80

              </code>
            </pre>
        <br>

            <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm"> <Output>
Output:
Hello, World!</Output></pre>
            <button class="absolute top-2 right-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent)">
              Copy
            </button>
          </div>

          <h3 id="explain-instructions" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">🔹 Explain Each Instruction</h3>
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <p><strong class="text-blue-800">mov eax, 4</strong> → Moves value 4 into EAX register (used for system calls).</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <p><strong class="text-blue-800">int 0x80</strong> → Calls the Linux kernel to perform an operation.</p>
            </div>
          </div>

          <h3 id="analogy" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">🔹 Analogy</h3>
          <div class="mb-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p>Assembly is like speaking directly to a machine, while Python is like using a translator!</p>
          </div>
        `,
      })
    } else if (id === "2") {
      setTutorial({
        id: "2",
        title: "CPU Registers and Memory (Beginner-Friendly)",
        description: "Learn how the CPU stores and processes data using registers and memory.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder - replace with actual video
        content: `
          <h2 id="goal" class="text-xl font-semibold mb-3 cursor-pointer hover:text-blue-600 transition-colors">📌 Goal</h2>
          <div class="mb-6 pl-4 border-l-4 border-blue-200">
            <p>Explain how the CPU stores and processes data.</p>
          </div>
          
          <h2 id="concepts" class="text-xl font-semibold mb-3 cursor-pointer hover:text-blue-600 transition-colors">🎯 Key Concepts to Cover</h2>

          <h3 id="registers" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">1️⃣ What Are Registers?</h3>
          <ul class="list-disc ml-6 mb-6 space-y-2">
            <li class="hover:bg-blue-50 p-1 rounded">Registers are tiny memory units inside the CPU that store data temporarily.</li>
            <li class="hover:bg-blue-50 p-1 rounded">They are much faster than RAM but store less data.</li>
          </ul>

          <h4 id="register-types" class="font-bold mt-2 mb-2 cursor-pointer hover:text-blue-600 transition-colors">Types of Registers in x86 (Simple Explanation):</h4>
          <div class="mb-6 overflow-x-auto">
            <table class="min-w-full border border-gray-300 mt-2">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border px-4 py-2">Register</th>
                  <th class="border px-4 py-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr class="hover:bg-blue-50"><td class="border px-4 py-2 font-mono">EAX</td><td class="border px-4 py-2">Stores numbers and results of calculations</td></tr>
                <tr class="hover:bg-blue-50"><td class="border px-4 py-2 font-mono">EBX</td><td class="border px-4 py-2">Used for general storage</td></tr>
                <tr class="hover:bg-blue-50"><td class="border px-4 py-2 font-mono">ECX</td><td class="border px-4 py-2">Used for loops (counter register)</td></tr>
                <tr class="hover:bg-blue-50"><td class="border px-4 py-2 font-mono">EDX</td><td class="border px-4 py-2">Extra data storage</td></tr>
                <tr class="hover:bg-blue-50"><td class="border px-4 py-2 font-mono">ESP</td><td class="border px-4 py-2">Stack pointer (manages function calls)</td></tr>
                <tr class="hover:bg-blue-50"><td class="border px-4 py-2 font-mono">EBP</td><td class="border px-4 py-2">Base pointer (used for local variables)</td></tr>
              </tbody>
            </table>
          </div>

          <h3 id="memory" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">2️⃣ How Memory Works in Assembly?</h3>
          <ul class="list-disc ml-6 mb-6 space-y-2">
            <li class="hover:bg-blue-50 p-1 rounded">The CPU fetches data from RAM → stores it in registers → processes it.</li>
            <li class="hover:bg-blue-50 p-1 rounded">Every memory location has a unique address.</li>
            <li class="hover:bg-blue-50 p-1 rounded">In Assembly, we can load values into registers and store them in memory.</li>
          </ul>

          <h3 id="example-code" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">3️⃣ Example Code to Show Register Usage</h3>
          <div class="mb-6 relative group">
            <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>
section .text
    global _start
_start:
    mov eax, 5    ; Store 5 in register EAX
    add eax, 10   ; Add 10 → EAX now holds 15
    mov ebx, eax  ; Copy value from EAX to EBX
    int 0x80      ; Exit

              </code>
            </pre>
            <button class="absolute top-2 right-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent)">
              Copy
            </button>
          </div>

          <h3 id="explanation" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">🔹 Explain in Simple Words</h3>
          <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="bg-green-50 p-3 rounded-lg">
              <p><strong class="text-green-800">mov eax, 5</strong> → Put 5 inside EAX register</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <p><strong class="text-green-800">add eax, 10</strong> → Add 10 to whatever is inside EAX</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <p><strong class="text-green-800">mov ebx, eax</strong> → Copy EAX's value into EBX</p>
            </div>
          </div>

          <h3 id="easy-remember" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">📌 Easy to Remember</h3>
          <div class="mb-6 bg-purple-50 p-4 rounded-lg">
            <ul class="list-disc ml-6 space-y-2">
              <li class="hover:bg-purple-100 p-1 rounded">Registers are like variables in C, but faster!</li>
              <li class="hover:bg-purple-100 p-1 rounded">Registers are like pockets; RAM is like a backpack (slower but holds more stuff).</li>
            </ul>
          </div>
        `,
      })
    } else if (id === "3") {
      setTutorial({
        id: "3",
        title: "Basic Assembly Commands (Beginner-Friendly)",
        description: "Learn the most essential assembly instructions with clear examples.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder - replace with actual video
        content: `
          <h2 id="goal" class="text-xl font-semibold mb-3 cursor-pointer hover:text-blue-600 transition-colors">📌 Goal</h2>
          <div class="mb-6 pl-4 border-l-4 border-blue-200">
            <p>Teach basic Assembly commands with clear explanations.</p>
          </div>
          
          <h2 id="concepts" class="text-xl font-semibold mb-3 cursor-pointer hover:text-blue-600 transition-colors">🎯 Key Concepts to Cover</h2>

          <h3 id="instructions" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">1️⃣ The Most Important Assembly Instructions</h3>
          <div class="mb-6 overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border px-4 py-2">Instruction</th>
                  <th class="border px-4 py-2">Meaning</th>
                  <th class="border px-4 py-2">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr class="hover:bg-blue-50">
                  <td class="border px-4 py-2 font-mono">MOV</td>
                  <td class="border px-4 py-2">Move data between registers/memory</td>
                  <td class="border px-4 py-2 font-mono">MOV EAX, 10 (Store 10 in EAX)</td>
                </tr>
                <tr class="hover:bg-blue-50">
                  <td class="border px-4 py-2 font-mono">ADD</td>
                  <td class="border px-4 py-2">Add numbers</td>
                  <td class="border px-4 py-2 font-mono">ADD EAX, 5 (EAX = EAX + 5)</td>
                </tr>
                <tr class="hover:bg-blue-50">
                  <td class="border px-4 py-2 font-mono">SUB</td>
                  <td class="border px-4 py-2">Subtract numbers</td>
                  <td class="border px-4 py-2 font-mono">SUB EAX, 2 (EAX = EAX - 2)</td>
                </tr>
                <tr class="hover:bg-blue-50">
                  <td class="border px-4 py-2 font-mono">CMP</td>
                  <td class="border px-4 py-2">Compare values</td>
                  <td class="border px-4 py-2 font-mono">CMP EAX, EBX (Compare EAX & EBX)</td>
                </tr>
                <tr class="hover:bg-blue-50">
                  <td class="border px-4 py-2 font-mono">JMP</td>
                  <td class="border px-4 py-2">Jump to a different instruction</td>
                  <td class="border px-4 py-2 font-mono">JMP label1 (Go to label1)</td>
                </tr>
                <tr class="hover:bg-blue-50">
                  <td class="border px-4 py-2 font-mono">PUSH/POP</td>
                  <td class="border px-4 py-2">Store and retrieve data from the stack</td>
                  <td class="border px-4 py-2 font-mono">PUSH EAX (Save EAX value)<br>POP EBX (Restore into EBX)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 id="example-code" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">2️⃣ Example Code Using Basic Instructions</h3>
          <div class="mb-6 relative group">
            <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>
section .data
    msg db "Result: ", 0      ; Message prefix
    newline db 10             ; Newline character
    num db "15", 0            ; Number as a string

section .text
    global _start

_start:
    ; MOV example: Load 10 into EAX
    mov eax, 10              

    ; ADD example: Add 5 to EAX (EAX = 10 + 5 = 15)
    add eax, 5              

    ; CMP example: Compare EAX with 15
    cmp eax, 15             
    je print_result          ; If equal, jump to print_result

print_result:
    ; Write "Result: " message
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    mov edx, 8
    int 0x80

    ; Write number "15"
    mov eax, 4
    mov ebx, 1
    mov ecx, num
    mov edx, 2
    int 0x80

    ; Print newline
    mov eax, 4
    mov ebx, 1
    mov ecx, newline
    mov edx, 1
    int 0x80

    ; Exit program
    mov eax, 1
    mov ebx, 0
    int 0x80


              </code>

            </pre>
            <br>
            <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm"> <Output>
Output:
Result: 15</Output></pre>
            <button class="absolute top-2 right-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent)">
              Copy
            </button>
          </div>

          <h3 id="explanation" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">🔹 Explain in Simple Words</h3>
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <p><strong class="text-blue-800">cmp eax, 15</strong> → Check if EAX contains 15</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <p><strong class="text-blue-800">je equal_label</strong> → If it does, jump to equal_label</p>
            </div>
          </div>

          <h3 id="engaging" class="text-lg font-bold mt-4 mb-2 cursor-pointer hover:text-blue-600 transition-colors">📌For Better Understanding</h3>
          <ul class="list-disc ml-6 mb-6 space-y-2">
         
            <li class="hover:bg-blue-50 p-1 rounded">Use a real-world analogy: JMP is like choosing a different path in a game based on a condition!</li>
          </ul>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-800 mb-2">💡 Pro Tip:</h4>
            <p className="mb-2">Assembly instructions are like building blocks - combine them to create complex programs!</p>
            <p>MOV is your "put this there" command, while JMP is your "go to that place" command.</p>
          </div>
        `,
      })
    } else {
      fetch(`/api/tutorials/${id}`)
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then((data: Tutorial) => setTutorial(data))
        .catch((error: Error) => {
          console.error("Error fetching tutorial:", error)
          // Set a fallback tutorial or error state
          setTutorial({
            id: id || "0",
            title: "Tutorial Not Found",
            description: "We couldn't find the tutorial you're looking for.",
            content: "<p>The requested tutorial could not be loaded. Please try another tutorial.</p>",
          })
        })
    }
  }, [id])

  // Parse the table of contents when tutorial content is available
  useEffect(() => {
    if (tutorial?.content) {
      // Create a temporary DOM element to parse HTML
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = tutorial.content

      // Find all heading elements
      const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6")

      const toc = Array.from(headings)
        .map((heading) => {
          const id = heading.id
          const title = heading.textContent?.trim() || ""
          const level = Number.parseInt(heading.tagName.substring(1), 10) // Get the heading level (1-6)

          return { id, title, level }
        })
        .filter((item) => item.id && item.title) // Filter out items without id or title

      setTableOfContents(toc)
    }
  }, [tutorial])

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!tutorial) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tutorial header with title and navigation */}
      <div className="mb-8">
        <Link to="/tutorial" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tutorials
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutorial.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{tutorial.description}</p>

        {/* Content/Video tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("content")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "content"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Written Tutorial
              </div>
            </button>
            {tutorial.videoUrl && (
              <button
                onClick={() => setActiveTab("video")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "video"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              ></button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar navigation */}
        <div className="md:w-1/4">
          <div className="sticky top-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Table of Contents</h2>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-1 px-2 rounded hover:bg-blue-50 transition-colors ${
                    activeSection === item.id ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"
                  } ${item.level > 2 ? "ml-4" : ""}`} // Add indentation for sub-headings
                  onClick={(e) => {
                    e.preventDefault()
                    handleSectionClick(item.id)
                  }}
                >
                  {item.title}
                </a>
              ))}
            </nav>

            {/* Additional resources */}
            <div className="mt-8">
              <div className="space-y-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {activeTab === "content" ? (
              <div
                className="p-6 text-gray-800 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: tutorial.content }}
              />
            ) : (
              <div className="p-6">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    src={tutorial.videoUrl}
                    title={tutorial.title}
                    className="w-full h-[500px]"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-6">
                  <h2 className="text-2xl font-bold mb-4">Video Transcript</h2>
                  <p className="text-gray-600">
                    This video tutorial covers all the key concepts of {tutorial.title.toLowerCase()}, including
                    practical examples and demonstrations. Follow along with the instructor as they guide you through
                    the fundamentals of assembly language programming.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <button
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑ Back to Top
            </button>
            <div className="space-x-4">
              {Number.parseInt(tutorial.id) > 1 && (
                <Link
                  to={`/tutorial/${Number.parseInt(tutorial.id) - 1}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Previous Tutorial
                </Link>
              )}
              {Number.parseInt(tutorial.id) < 3 && (
                <Link
                  to={`/tutorial/${Number.parseInt(tutorial.id) + 1}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Next Tutorial →
                </Link>
              )}
            </div>
          </div>

          {/* Related tutorials */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3]
                .filter((num) => num !== Number.parseInt(tutorial.id))
                .map((num) => (
                  <Link
                    key={num}
                    to={`/tutorial/${num}`}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {num === 1
                        ? "Introduction to Assembly"
                        : num === 2
                          ? "CPU Registers and Memory"
                          : "Basic Assembly Commands"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {num === 1
                        ? "Learn the basics of assembly language programming"
                        : num === 2
                          ? "Understanding CPU registers and memory management"
                          : "Common assembly instructions and their usage"}
                    </p>
                    <div className="mt-2 text-indigo-600 text-sm flex items-center">
                      View Tutorial
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialDetail
