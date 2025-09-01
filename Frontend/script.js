let editor;
let topicsData = {};
let currentTopicId = null;

// --- Monaco Editor Setup ---

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `// Select a topic and language to start coding!`,
        language: 'c',
        theme: 'vs-dark',
        automaticLayout: true,
    });
});

// --- DOM Element References ---

const themeToggle = document.getElementById('theme-toggle');
const topicList = document.getElementById('topic-list');
const languageSelect = document.getElementById('language-select');
const runBtn = document.getElementById('run-btn');
const outputConsole = document.getElementById('output-console');
const stdinInput = document.getElementById('stdin-input'); 
const welcomeScreen = document.getElementById('welcome-screen');
const topicContent = document.getElementById('topic-content');
const getStartedBtn = document.getElementById('get-started-btn');
const topicTitle = document.getElementById('topic-title');
const topicExplanation = document.getElementById('topic-explanation');
const topicSyntaxContainer = document.getElementById('topic-syntax-container');
const topicSyntax = document.getElementById('topic-syntax');
const topicExampleContainer = document.getElementById('topic-example-container');
const topicExample = document.getElementById('topic-example');
const topicTldrContainer = document.getElementById('topic-tldr-container');
const topicTldr = document.getElementById('topic-tldr');
const homeLink = document.getElementById('home-link');
const uploadLink = document.getElementById('upload-link');
const communityLink = document.getElementById('community-link');
const learningZone = document.getElementById('learning-zone');
const uploadZone = document.getElementById('upload-zone');
const communityZone = document.getElementById('community-zone');
const fileUploadInput = document.getElementById('file-upload-input');
const uploadStatus = document.getElementById('upload-status');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const challengesLink = document.getElementById('challenges-link');
const challengesZone = document.getElementById('challenges-zone');
const userProfileContainer = document.getElementById('user-profile-container');
const submitProblemBtn = document.getElementById('submit-problem-btn');
const problemListView = document.getElementById('problem-list-view');
const problemDetailView = document.getElementById('problem-detail-view');
const problemListContainer = document.getElementById('problem-list-container');
const sortTrendingBtn = document.getElementById('sort-trending-btn');
const sortNewestBtn = document.getElementById('sort-newest-btn');
const backToListBtn = document.getElementById('back-to-list-btn');
const problemTitleDetail = document.getElementById('problem-title-detail');
const problemAuthorDetail = document.getElementById('problem-author-detail');
const problemDescriptionDetail = document.getElementById('problem-description-detail');
const submitSolutionBtn = document.getElementById('submit-solution-btn');

// --- Event Listeners ---

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    document.body.classList.toggle('dark', !document.documentElement.classList.contains('light'));
    const theme = document.documentElement.classList.contains('light') ? 'vs' : 'vs-dark';
    monaco.editor.setTheme(theme);
});
getStartedBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    topicContent.classList.remove('hidden');
});
languageSelect.addEventListener('change', updateEditorSnippet);
runBtn.addEventListener('click', executeCode);
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMainContent('learning-zone');
});
uploadLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMainContent('upload-zone');
});
communityLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMainContent('community-zone');
});
challengesLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMainContent('challenges-zone');
});
fileUploadInput.addEventListener('change', handleFileUpload);
chatSendBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});
backToListBtn.addEventListener('click', () => {
    problemListView.classList.remove('hidden');
    problemDetailView.classList.add('hidden');
});
sortTrendingBtn.addEventListener('click', () => {
    renderProblems('trending');
    sortTrendingBtn.classList.add('bg-accent-color', 'text-white');
    sortNewestBtn.classList.remove('bg-accent-color', 'text-white');
});
sortNewestBtn.addEventListener('click', () => {
    renderProblems('newest');
    sortNewestBtn.classList.add('bg-accent-color', 'text-white');
    sortTrendingBtn.classList.remove('bg-accent-color', 'text-white');
});

// --- Core Application Functions ---
async function loadTopics() { 
    try { 
        const res = await fetch('http://localhost:3000/api/topics'); 
        if (!res.ok) throw new Error("Failed to fetch topics"); 
        topicsData = await res.json(); 
        renderTopicList(); 
    } catch (err) { 
        console.error("Error loading topics:", err); 
    } 
}

function renderTopicList() { 
    topicList.innerHTML = ''; 
    for (const id in topicsData) { 
        const topic = topicsData[id]; 
        const link = document.createElement('a'); 
        link.href = '#'; 
        link.textContent = topic.title; 
        link.dataset.topicId = id; 
        link.className = 'block sidebar-link px-4 py-2 rounded-lg hover:bg-accent-color hover:text-white transition'; 
        link.addEventListener('click', (e) => { e.preventDefault(); displayTopic(id); }); 
        topicList.appendChild(link); 
    } 
}

function displayTopic(topicId) { 
    currentTopicId = topicId; 
    const topic = topicsData[topicId]; 
    if (!topic) return; 
    
    welcomeScreen.classList.add('hidden'); 
    topicContent.classList.remove('hidden'); 
    
    document.querySelectorAll('#topic-list a').forEach(link => { 
        link.classList.toggle('active', link.dataset.topicId === topicId); 
    }); 
    
    topicTitle.textContent = topic.title; 
    topicExplanation.innerHTML = topic.explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
    
    if (topic.syntax) { 
        const lang = languageSelect.value; 
        topicSyntax.textContent = topic.syntax[lang] || topic.syntax.c; 
        topicSyntaxContainer.classList.remove('hidden'); 
    } else { 
        topicSyntaxContainer.classList.add('hidden'); 
    } 
    
    if (topic.example) { 
        const lang = languageSelect.value; 
        const exampleContent = topic.example[lang] || topic.example.c; 
        topicExample.textContent = exampleContent; 
        topicExampleContainer.classList.remove('hidden'); 
    } else { 
        topicExampleContainer.classList.add('hidden'); 
    } 
    
    if (topic.tldr) { 
        topicTldr.textContent = topic.tldr; 
        topicTldrContainer.classList.remove('hidden'); 
    } else { 
        topicTldrContainer.classList.add('hidden'); 
    } 
    
    updateEditorSnippet(); 
}

function updateEditorSnippet() { 
    if (!currentTopicId) { 
        editor.setValue(`// Select a topic to see an example.`); 
        return; 
    }; 
    const topic = topicsData[currentTopicId]; 
    const lang = languageSelect.value; 
    if (topic && topic.example && topic.example[lang]) { 
        const snippet = topic.example[lang]; 
        editor.setValue(snippet); 
        const model = editor.getModel(); 
        if (model) { 
            monaco.editor.setModelLanguage(model, lang === 'cpp' ? 'cpp' : 'c'); 
        } 
    } 
}

async function executeCode() { 
    const code = editor.getValue(); 
    const language = languageSelect.value; 
    const languageId = language === 'cpp' ? 54 : 50; 
    const stdin = stdinInput.value; 
    
    runBtn.disabled = true; 
    runBtn.textContent = 'Running...'; 
    outputConsole.textContent = 'Executing...'; 
    
    try { 
        const response = await fetch('http://localhost:3000/api/run', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ code, language_id: languageId, stdin: stdin }) 
        }); 
        
        if (!response.ok) { 
            const errorData = await response.json(); 
            throw new Error(errorData.error || 'Execution failed.'); 
        } 
        
        const result = await response.json(); 
        let output = ''; 
        if (result.stdout) output += result.stdout; 
        if (result.stderr) output += `Error: ${result.stderr}`; 
        if (result.compile_output) output += `Compiler Error: ${result.compile_output}`; 
        if (result.message) output += `Message: ${result.message}`; 
        
        outputConsole.textContent = output || 'Execution finished with no output.'; 
    } catch (error) { 
        outputConsole.textContent = `An error occurred: ${error.message}`; 
    } finally { 
        runBtn.disabled = false; 
        runBtn.textContent = 'Run Code'; 
    } 
}

function handleFileUpload(event) { 
    const file = event.target.files[0]; 
    if (!file) { return; } 
    
    const reader = new FileReader(); 
    reader.onload = (e) => { 
        const content = e.target.result; 
        editor.setValue(content); 
        uploadStatus.textContent = `Successfully loaded ${file.name}! Redirecting to Home...`; 
        setTimeout(() => { 
            showMainContent('learning-zone'); 
            uploadStatus.textContent = ''; 
            fileUploadInput.value = ''; 
        }, 2000); 
    }; 
    reader.onerror = () => { 
        uploadStatus.textContent = `Error reading file: ${file.name}`; 
        uploadStatus.classList.remove('text-green-400'); 
        uploadStatus.classList.add('text-red-400'); 
    }; 
    reader.readAsText(file); 
}

// --- Community & Challenges Functions ---
function sendChatMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;
    createMessageBubble({ user: 'You', role: 'user', text: messageText });
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.focus();
}

function loadCommunityChat() {
    chatMessages.innerHTML = '';
    // This is placeholder data for demonstration purposes.
    const fakeConversation = [
        { user: 'Admin', role: 'admin', text: 'Hey everyone! Welcome to the community hub.' },
        { user: 'CodeNinja', role: 'member', text: 'Hi! Just checking out the new Challenges tab. Looks awesome!'},
        { user: 'ChallengeAuthor', role: 'author', text: 'Glad you like it! I just submitted the "Find Max in Array" problem. Let me know what you think.'},
        { user: 'BugFinder', role: 'member', text: 'I tried the "Reverse a String" challenge and got the "String Sorcerer" badge. So cool!'},
        { user: 'Admin', role: 'admin', text: 'Nice job @BugFinder! Remember, once you get 2 badges, you can submit your own problems too.'},
        { user: 'CodeNinja', role: 'member', text: 'Oh, really? That\'s great motivation! I\'m going for it.'}
    ];
    fakeConversation.forEach(msg => createMessageBubble(msg));
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Creates a chat message bubble with styling based on the user's role.
 * @param {object} message - The message object containing user, role, and text.
 */
function createMessageBubble(message) {
    const messageElement = document.createElement('div');
    const userElement = document.createElement('p');
    const textElement = document.createElement('p');

    let bgColor = 'bg-gray-700';
    let nameColor = 'text-accent-color';
    let textColor = 'text-gray-200';
    let alignment = 'mr-auto';

    // Apply specific styles based on the user's role
    if (message.role === 'admin') {
        bgColor = 'bg-indigo-600';
        nameColor = 'text-yellow-300';
        textColor = 'text-white';
    } else if (message.role === 'author') {
        bgColor = 'bg-green-700';
        nameColor = 'text-yellow-300';
        textColor = 'text-green-100';
    } else if (message.role === 'user') {
        bgColor = 'bg-accent-color';
        nameColor = 'text-white';
        textColor = 'text-white';
        alignment = 'ml-auto';
    }
    
    messageElement.className = `p-3 rounded-lg max-w-md ${bgColor} ${alignment}`;
    userElement.className = `font-bold ${nameColor}`;
    textElement.className = `${textColor}`;
    
    userElement.textContent = message.user;
    textElement.textContent = message.text;

    messageElement.appendChild(userElement);
    messageElement.appendChild(textElement);
    chatMessages.appendChild(messageElement);
}

function initializeData() {
    // Set up a default user profile in local storage if one doesn't exist.
    if (!localStorage.getItem('userProfile')) {
        const user = { username: 'CodeNewbie', role: 'member', badges: [], problemsSolved: 0 };
        localStorage.setItem('userProfile', JSON.stringify(user));
    }
    // Set up default coding problems in local storage if they don't exist.
    if (!localStorage.getItem('problems')) {
        const problems = [
            { id: 1, title: "Sum Two Numbers", author: "Admin", status: "approved", description: "Write a program that takes two numbers as input and prints their sum.", badge: "Addition Adept 🎖️", viewCount: 25, solveAttempts: 10 },
            { id: 2, title: "Reverse a String", author: "Admin", status: "approved", description: "Write a program that takes a string (like 'hello') and prints it in reverse ('olleh').", badge: "String Sorcerer 🧙", viewCount: 50, solveAttempts: 15 },
            { id: 3, title: "Find Max in Array", author: "ChallengeAuthor", status: "approved", description: "Given an array of integers, find and print the largest number.", badge: "Peak Finder 🏔️", viewCount: 10, solveAttempts: 2 },
        ];
        localStorage.setItem('problems', JSON.stringify(problems));
    }
}

function showMainContent(zoneId) {
    // Hide all main content zones
    learningZone.classList.add('hidden');
    uploadZone.classList.add('hidden');
    communityZone.classList.add('hidden');
    challengesZone.classList.add('hidden');

    // Deactivate all navigation links
    homeLink.classList.remove('active');
    uploadLink.classList.remove('active');
    communityLink.classList.remove('active');
    challengesLink.classList.remove('active');

    // Show the selected zone and activate its corresponding link
    if (zoneId === 'learning-zone') {
        learningZone.classList.remove('hidden');
        homeLink.classList.add('active');
    } else if (zoneId === 'upload-zone') {
        uploadZone.classList.remove('hidden');
        uploadLink.classList.add('active');
    } else if (zoneId === 'community-zone') {
        communityZone.classList.remove('hidden');
        communityLink.classList.add('active');
        loadCommunityChat();
    } else if (zoneId === 'challenges-zone') {
        challengesZone.classList.remove('hidden');
        challengesLink.classList.add('active');
        problemListView.classList.remove('hidden');
        problemDetailView.classList.add('hidden');
        renderUserProfile();
        renderProblems('newest'); 
    }
}

function renderUserProfile() {
    const user = JSON.parse(localStorage.getItem('userProfile'));
    userProfileContainer.innerHTML = `
        <span class="font-bold text-lg">${user.username}</span>
        <span class="px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'maintainer' ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-200'}">${user.role}</span>
    `;
    const badgesContainer = document.createElement('div');
    badgesContainer.className = 'flex items-center gap-2 flex-wrap';
    badgesContainer.innerHTML = '<span class="font-semibold">Badges:</span>';
    if (user.badges.length > 0) {
        user.badges.forEach(badge => {
            badgesContainer.innerHTML += `<span class="bg-accent-color text-white text-xs font-bold px-2 py-1 rounded-full">${badge}</span>`;
        });
    } else {
         badgesContainer.innerHTML += `<span class="text-gray-400 italic">None yet!</span>`;
    }
    userProfileContainer.appendChild(badgesContainer);
    updateSubmitButtonState();
}

function renderProblems(sortBy = 'newest') {
    let problems = JSON.parse(localStorage.getItem('problems'));
    problemListContainer.innerHTML = '';
    
    if (sortBy === 'trending') {
        problems.sort((a, b) => (b.viewCount + b.solveAttempts) - (a.viewCount + a.solveAttempts));
    } else {
        problems.sort((a, b) => b.id - a.id);
    }

    problems.filter(p => p.status === 'approved').forEach(problem => {
        const card = document.createElement('div');
        card.className = 'bg-secondary-bg p-4 rounded-lg border border-border-color cursor-pointer hover:border-accent-color transition';
        card.innerHTML = `
            <h4 class="text-xl font-bold text-accent-color">${problem.title}</h4>
            <p class="text-sm mt-1">By: ${problem.author}</p>
            <div class="text-xs mt-2 flex items-center gap-4 text-gray-400">
                <span>👁️ ${problem.viewCount} views</span>
                <span>✔️ ${problem.solveAttempts} attempts</span>
            </div>
        `;
        card.addEventListener('click', () => showProblemDetail(problem.id));
        problemListContainer.appendChild(card);
    });
}

function canSubmitProblem() {
    const user = JSON.parse(localStorage.getItem('userProfile'));
    return user.badges.length >= 2;
}

function updateSubmitButtonState() {
    if (canSubmitProblem()) {
        submitProblemBtn.disabled = false;
        submitProblemBtn.title = "You have enough badges to submit a problem!";
    } else {
        submitProblemBtn.disabled = true;
        submitProblemBtn.title = "You need to earn at least 2 badges to submit a new problem.";
    }
}

function showProblemDetail(problemId) {
    let problems = JSON.parse(localStorage.getItem('problems'));
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    
    // Increment view count when a problem is viewed
    problem.viewCount++;
    localStorage.setItem('problems', JSON.stringify(problems));

    problemListView.classList.add('hidden');
    problemDetailView.classList.remove('hidden');

    problemTitleDetail.textContent = problem.title;
    problemAuthorDetail.textContent = `By ${problem.author}`;
    problemDescriptionDetail.textContent = problem.description;

    submitSolutionBtn.onclick = () => {
        problem.solveAttempts++;
        localStorage.setItem('problems', JSON.stringify(problems));
        awardBadge(problem.badge);
    };
}

function awardBadge(badgeName) {
    const user = JSON.parse(localStorage.getItem('userProfile'));
    if (!user.badges.includes(badgeName)) {
        user.badges.push(badgeName);
        user.problemsSolved = user.badges.length;
        localStorage.setItem('userProfile', JSON.stringify(user));
        alert(`🎉 Badge Unlocked: ${badgeName}!`);
        renderUserProfile();
    } else {
        alert("You've already earned this badge!");
    }
}

// This function runs when the page content is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    loadTopics();
    if (!document.documentElement.classList.contains('light')) {
         document.body.classList.add('dark');
    }
});
