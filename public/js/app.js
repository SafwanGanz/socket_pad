import { debounce, generateUserColor } from './utils.js';

let userId;
let users = [];
let isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const editor = document.getElementById('editor');
const usersList = document.getElementById('users');
const connectionStatus = document.getElementById('connection-status');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  body.className = isDarkTheme ? 'theme-dark' : 'theme-light';
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkTheme = savedTheme === 'dark';
  } else {
    isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  body.className = isDarkTheme ? 'theme-dark' : 'theme-light';
}

const socket = io();

const savedDraft = localStorage.getItem('draft');
if (savedDraft) editor.value = savedDraft;

socket.on('init', ({ content, userId: id, users: initialUsers }) => {
  userId = id;
  editor.value = content;
  localStorage.setItem('draft', content);
  updateConnectionStatus(true);
  users = initialUsers;
  renderUsers();
});

socket.on('text-update', ({ delta, userId: senderId }) => {
  if (senderId !== userId) {
    const cursorPosition = editor.selectionStart;
    editor.value += delta;
    editor.setSelectionRange(cursorPosition, cursorPosition);
    localStorage.setItem('draft', editor.value);
  }
});

socket.on('user-connected', (user) => {
  users = [...users, user];
  renderUsers();
});

socket.on('user-disconnected', (userId) => {
  users = users.filter(u => u.id !== userId);
  renderUsers();
});

socket.on('cursor-update', ({ userId: senderId, position }) => {});

editor.addEventListener('input', debounce((e) => {
  const content = e.target.value;
  const delta = content.slice(-1);
  localStorage.setItem('draft', content);
  socket.emit('text-update', { delta, userId });
}, 100));

themeToggle.addEventListener('click', toggleTheme);

initTheme();

function renderUsers() {
  usersList.innerHTML = users.map(user => `
    <li>
      <div class="user-badge" style="background: ${generateUserColor(user.id)}">
        ${user.id.slice(0, 2).toUpperCase()}
      </div>
      ${user.id}
    </li>
  `).join('');
}

function updateConnectionStatus(connected) {
  connectionStatus.innerHTML = `
    <div class="status-indicator ${connected ? 'connected' : ''}"></div>
    ${connected ? 'Connected' : 'Disconnected'}
  `;
}