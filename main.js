// Elements
const chatContainer = document.querySelector('.chat-container');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat');

// Add message
function addMessage(text, sender = 'user') {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Simulate AI response
function simulateAIResponse() {
    const typingEl = document.createElement('div');
    typingEl.classList.add('message', 'ai');
    typingEl.textContent = "Siitecch GPT is typing...";
    chatContainer.appendChild(typingEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    setTimeout(() => {
        typingEl.textContent = "This is a simulated AI response (replace with API call).";
    }, 1500);
}

// Send message
function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    simulateAIResponse();
}

// New chat
newChatBtn.addEventListener('click', () => {
    chatContainer.innerHTML = '';
});

// Events
sendBtn.addEventListener('click', handleSend);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});


// ===== Subject/Topic/Goal Popup Logic =====
const selectSubjectBtn = document.getElementById('select-subject-btn');
const popup = document.getElementById('popup-container');
const subjectOptions = document.getElementById('subject-options');
const topicStep = document.getElementById('topic-step');
const topicOptions = document.getElementById('topic-options');
const goalStep = document.getElementById('goal-step');

// Subject → Topics Map
const topicsData = {
    Math: ["Fractions", "Algebra", "Geometry"],
    English: ["Grammar", "Comprehension", "Vocabulary"]
};

// Show popup
selectSubjectBtn.addEventListener('click', () => {
    popup.classList.toggle('hidden');
    // Reset steps
    topicStep.classList.add('hidden');
    goalStep.classList.add('hidden');
});

// Handle subject selection
subjectOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-option')) {
        const subject = e.target.dataset.subject;
        // Populate topics
        topicOptions.innerHTML = topicsData[subject]
            .map(topic => `<button class="popup-option" data-topic="${topic}">${topic}</button>`)
            .join('');
        topicStep.classList.remove('hidden');
        goalStep.classList.add('hidden');
    }
});

// Handle topic selection
topicOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-option')) {
        // Show goals step
        goalStep.classList.remove('hidden');
    }
});

// Handle goal click (final action)
goalStep.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-option')) {
        const goal = e.target.textContent;
        popup.classList.add('hidden');
        addMessage(`Selected goal: ${goal}`, 'user');
        simulateAIResponse();
    }
});

// Close popup on outside click
document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== selectSubjectBtn) {
        popup.classList.add('hidden');
    }
});


// ===== In-Class Logic =====
const inClassBtn = document.getElementById('in-class-btn');
const inClassPopup = document.getElementById('in-class-popup');
const createGroupPopup = document.getElementById('create-group-form');
const joinGroupPopup = document.getElementById('join-group-list');
const groupList = document.getElementById('group-list');
const createGroupBtn = document.getElementById('create-group-btn');
const joinGroupBtn = document.getElementById('join-group-btn');
const submitGroupBtn = document.getElementById('submit-group-btn');
const groupNameInput = document.getElementById('group-name');
const groupSubjectSelect = document.getElementById('group-subject');

let groups = JSON.parse(localStorage.getItem('groups')) || [];

// Show main in-class popup
inClassBtn.addEventListener('click', () => {
    inClassPopup.classList.toggle('hidden');
});

// Handle create group flow
createGroupBtn.addEventListener('click', () => {
    inClassPopup.classList.add('hidden');
    createGroupPopup.classList.remove('hidden');
});

submitGroupBtn.addEventListener('click', () => {
    const name = groupNameInput.value.trim();
    const subject = groupSubjectSelect.value;
    if (!name) return alert("Enter group name");

    const newGroup = {
        id: Date.now(),
        name,
        subject,
        members: [],
        maxMembers: 7
    };

    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));

    createGroupPopup.classList.add('hidden');
    alert(`Group "${name}" created! Waiting for others to join.`);
});

// Handle join group flow
joinGroupBtn.addEventListener('click', () => {
    window.location.href = "inClass.html";
});

// Render groups list
function renderGroups() {
    groupList.innerHTML = groups
        .filter(g => g.members.length < g.maxMembers)
        .map(g => `
      <div class="group-card" data-id="${g.id}">
        <strong>${g.name}</strong><br/>
        <small>${g.subject}</small><br/>
        <small>${g.members.length}/7 members</small>
      </div>
    `).join('');

    // Add join click events
    document.querySelectorAll('.group-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = Number(card.dataset.id);
            joinGroup(id);
        });
    });
}

function joinGroup(id) {
    const group = groups.find(g => g.id === id);
    if (group.members.length >= group.maxMembers) {
        alert("Group is full");
        return;
    }

    group.members.push(`User${group.members.length + 1}`);
    localStorage.setItem('groups', JSON.stringify(groups));

    if (group.members.length >= group.maxMembers) {
        alert(`Group "${group.name}" is now full and locked!`);
        joinGroupPopup.classList.add('hidden');
        // Redirect to group chat page
        window.location.href = `inClass?group=${id}`;
    } else {
        alert(`Joined "${group.name}" (${group.members.length}/7)`);
        joinGroupPopup.classList.add('hidden');
        window.location.href = `inClass.html?group=${id}`;
    }
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    // Check if popup is open
    if (!inClassPopup.classList.contains('hidden')) {
        // If click is NOT inside popup and NOT on the button
        if (!inClassPopup.contains(e.target) && e.target !== inClassBtn) {
            inClassPopup.classList.add('hidden');
        }
    }

    // For create group popup
    if (!createGroupPopup.classList.contains('hidden')) {
        if (!createGroupPopup.contains(e.target) && e.target !== createGroupBtn) {
            createGroupPopup.classList.add('hidden');
        }
    }

    // For join group popup
    if (!joinGroupPopup.classList.contains('hidden')) {
        if (!joinGroupPopup.contains(e.target) && e.target !== joinGroupBtn) {
            joinGroupPopup.classList.add('hidden');
        }
    }
});
