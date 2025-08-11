// main.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== DOM ELEMENTS =====
  const subjectBtn = document.getElementById("select-subject-btn");
  const popupOverlay = document.getElementById("popup-overlay");
  const subjectOptions = document.getElementById("subject-options");
  const topicStep = document.getElementById("topic-step");
  const topicOptions = document.getElementById("topic-options");
  const goalStep = document.getElementById("goal-step");

  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const chatContainer = document.querySelector(".chat-container");

  // ===== DATA =====
  const topics = {
    Math: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
    English: ["Comprehension", "Grammar", "Vocabulary", "Essay Writing"]
  };

  // ===== STATE =====
  let inSession = false;
  let firstMessageSent = false;
  let selectedSubject = "";
  let selectedTopic = "";
  let selectedGoal = "";

  // Safety check (helps debugging if anything missing)
  if (!subjectBtn || !popupOverlay || !subjectOptions || !topicStep || !topicOptions || !goalStep || !messageInput || !sendBtn || !chatContainer) {
    console.error("main.js: missing DOM elements — check your HTML IDs");
    return;
  }

  // ===== Helpers =====
  function resetPopupSteps() {
    topicStep.classList.add("hidden");
    goalStep.classList.add("hidden");
  }

  function addMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // ===== NEW: Typing indicator =====
  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.classList.add("typing-indicator");
    indicator.id = "typing-indicator";
    indicator.innerHTML = "<span></span><span></span><span></span>";
    chatContainer.appendChild(indicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
  }
  // ===== END NEW =====

  // ===== Open popup (or end session when in session) =====
  subjectBtn.addEventListener("click", () => {
    if (inSession) {
      // acting as End Session
      endSession();
      return;
    }
    popupOverlay.classList.remove("hidden");
    resetPopupSteps();
  });

  // ===== Close popup when clicking overlay (outside the popup) =====
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.classList.add("hidden");
    }
  });

  // ===== Subject selection =====
  subjectOptions.addEventListener("click", (e) => {
    const btn = e.target.closest(".popup-option");
    if (!btn) return;
    const subj = btn.dataset.subject;
    if (!subj) return;
    selectedSubject = subj;

    // build topic buttons
    const arr = topics[selectedSubject] || [];
    topicOptions.innerHTML = arr
      .map(t => `<button class="popup-option" data-topic="${t}">${t}</button>`)
      .join("");

    topicStep.classList.remove("hidden");
    goalStep.classList.add("hidden");
  });

  // ===== Topic selection =====
  topicOptions.addEventListener("click", (e) => {
    const btn = e.target.closest(".popup-option");
    if (!btn) return;
    const topic = btn.dataset.topic;
    if (!topic) return;
    selectedTopic = topic;
    goalStep.classList.remove("hidden");
  });

  // ===== Goal selection =====
  goalStep.addEventListener("click", (e) => {
    const btn = e.target.closest(".popup-option");
    if (!btn) return;
    selectedGoal = btn.textContent.trim();

    // fill input with structured selection summary
    messageInput.value = `[Subject: ${selectedSubject}] [Topic: ${selectedTopic}] [Goal: ${selectedGoal}] - `;
    popupOverlay.classList.add("hidden");
    firstMessageSent = false;
  });

  // ===== Send message =====
  sendBtn.addEventListener("click", () => {
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    addMessage("user", userMessage);

    if (!firstMessageSent && selectedSubject && selectedTopic && selectedGoal) {
      firstMessageSent = true;
      startSession();
    }

    // ===== NEW: Show typing indicator immediately =====
    showTypingIndicator();

    // AI call
    fetch("https://sii-server.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    })
      .then(res => res.json())
      .then(data => {
        removeTypingIndicator(); // remove before adding AI reply
        addMessage("ai", data.reply || "No reply from AI");
      })
      .catch(err => {
        console.error(err);
        removeTypingIndicator();
        addMessage("ai", "⚠️ Error connecting to AI");
      });

    messageInput.value = "";
  });

  // ===== Start session =====
  function startSession() {
    inSession = true;
    subjectBtn.textContent = "End Session";
    addMessage("system", `📚 Session started: ${selectedSubject} → ${selectedTopic} → ${selectedGoal}`);
  }

  // ===== End session =====
  function endSession() {
    inSession = false;
    firstMessageSent = false;
    selectedSubject = "";
    selectedTopic = "";
    selectedGoal = "";
    messageInput.value = "";
    subjectBtn.textContent = "+Subject";
    chatContainer.innerHTML = "";
    addMessage("system", "❌ Session ended. Click +Subject to start again.");
  }
});
