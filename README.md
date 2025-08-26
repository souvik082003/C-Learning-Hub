C & C++ Learning Hub
Welcome to the C & C++ Learning Hub! This is an interactive website designed to help college beginners learn the fundamentals of C and C++ programming. The platform provides a two-panel layout that combines theory and hands-on practice, allowing students to learn concepts and immediately apply them by writing and running code.

Features
Two-Panel Layout: A dedicated "Theory Zone" for explanations and a "Practice Zone" for coding.

Comprehensive Topics: Covers all essential beginner topics, from algorithms and variables to pointers and structures.

Interactive Code Editor: Features the Monaco Editor (the same editor used in VS Code) with syntax highlighting for C and C++.

Live Code Execution: Run C and C++ code directly in the browser and see the output instantly. The backend uses the Judge0 API for robust code compilation and execution.

Language Switcher: Easily toggle between C and C++ to see code examples for the same concept in both languages.

Dark/Light Mode: A theme toggle for a comfortable learning experience.

Project Structure
The project is organized into two main parts: a frontend and a backend.

.
├── frontend/
│   └── index.html      # The main user interface and all frontend logic
│
├── backend/
│   ├── server.js       # The Node.js Express server
│   ├── topics.json     # A file containing all the topic data (can be used instead of hardcoding in HTML)
│   └── package.json    # Manages backend dependencies
│
└── README.md           # You are here!

Setup and Installation
Follow these steps to get the project running on your local machine.

1. Prerequisites
Make sure you have Node.js installed on your computer. You can check if it's installed by opening your terminal and running:

node -v

If you see a version number, you're good to go. If not, please download and install it from the official website.

2. Backend Setup
The backend server handles the logic for running your code.

Navigate to the backend directory:

cd backend

Install the necessary packages:

npm install

This will install express, cors, and axios.

3. Get Your API Key
The code execution is powered by the Judge0 API. You will need a free API key to make it work.

Go to the Judge0 CE API page on RapidAPI.

Click "Subscribe to Test" and choose the free Basic plan.

Once subscribed, go to the "Endpoints" tab. You will see your API key (X-RapidAPI-Key) in the code snippets on the right.

Open the backend/server.js file and replace the placeholder 'YOUR_RAPIDAPI_KEY' with the key you just copied.

// Inside backend/server.js
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || 'YOUR_RAPIDAPI_KEY'; // <--- PASTE YOUR KEY HERE

How to Run the Project
Start the Backend Server:

Make sure you are in the backend directory in your terminal.

Run the following command:

node server.js

You should see the message: Server is running on http://localhost:3000

Keep this terminal window open!

Open the Frontend:

Navigate to the frontend folder on your computer.

Double-click the index.html file to open it in your web browser (like Chrome or Firefox).

The website should now be fully functional. You can select topics, write code, and click the "Run Code" button to see the output.

Happy Coding! 🚀
