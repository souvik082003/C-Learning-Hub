# 🔥 C & C++ Learning Hub 🔥

Ready to conquer the world of **C and C++**?  
You've come to the right place! 🚀  

The **C & C++ Learning Hub** is an all-in-one, interactive platform built to launch your programming journey. Forget boring textbooks — here, you'll **learn by doing**, with a powerful **dual-panel layout** that puts theory and practice side-by-side. Learn a concept, then immediately crush the code. 💻⚡

---

## 🌟 Features

✅ **Dual-Zone Interface** → Master concepts in the *Theory Zone* 🧠 and immediately apply them in the *Practice Zone* 💻.  
✅ **Epic Topic Coverage** → Everything from basics (Algorithms, Variables) to mind-bending topics (Pointers, Recursion).  
✅ **Pro-Level Code Editor** → Built with the Monaco Editor (the heart of VS Code!) with full syntax highlighting for C & C++.  
✅ **Instant Code Execution** → Powered by the Judge0 API. Just hit **Run** and see your code come alive.  
✅ **C vs. C++ Showdown** → Instantly switch between examples to compare both languages.  
✅ **Day & Night Modes** → Code comfortably with a built-in theme toggle ☀️🌙.  

---

## 🛠️ Installation & Setup

Follow these steps to get the project running locally:

### 1. Install Node.js
Make sure you have **Node.js** installed:  
```bash
node -v
```
Open backend/server.js and replace:

const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || 'PASTE_YOUR_AWESOME_KEY_HERE';

If you don’t see a version, [download Node.js here](https://nodejs.org/).

Backend Setup
```bash
cd backend
npm install
```
This installs required dependencies: express, cors, and axios.

Configure Judge0 API
We use the Judge0 CE API for code execution.
Go to [Judge0 CE API on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/).
Click "Subscribe to Test" (choose the free Basic plan).
Copy your X-RapidAPI-Key.
Open backend/server.js and replace:
```bash
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || 'PASTE_YOUR_AWESOME_KEY_HERE';
```
Run the Backend
```bash
node server.js
```
If successful, you’ll see:
Server is running on http://localhost:3000
---

## Run the Frontend

Open the frontend folder.

Double-click index.html.

The website will open in your browser 🎉.

---

## 🤝 Contributing

Contributions are welcome!

Fork the repo 🍴

Create a new branch: git checkout -b feature-xyz

Commit changes: git commit -m "Added feature xyz"

Push: git push origin feature-xyz

Open a Pull Request ✅

