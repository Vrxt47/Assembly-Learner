# Assembly Learning Platform

An interactive platform for learning assembly language programming with tutorials, a code playground, and a CPU simulator.

## Features

- Interactive Assembly Code Playground
- CPU Simulator
- Comprehensive Tutorials
- Video Learning Resources


### Prerequisites
1. JDoodle API credentials (CLIENT_ID and CLIENT_SECRET)

### Local Development

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   npm install
   \`\`\`
4. Run the backend:
   \`\`\`
   python index.py
   \`\`\`
5. Run the frontend:
   \`\`\`
   npm run dev
   \`\`\`

## API Endpoints

- `GET /api`: Health check endpoint
- `GET /api/test`: Test endpoint
- `POST /api/execute`: Execute assembly code using JDoodle API

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Flask (Python)
