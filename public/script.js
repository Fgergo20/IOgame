let socket;
let myName = "";

const nameScreen = document.getElementById("nameScreen");
const chatScreen = document.getElementById("chatScreen");
const chatMessages = document.getElementById("chatMessages");
const chatInputBox = document.getElementById("chatInputBox");
const nameInput = document.getElementById("nameInput");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const joinBtn = document.getElementById("joinBtn");

joinBtn.onclick = joinChat;
chatInput.addEventListener("keydown", e => { if (e.key === "Enter") sendMsg(); });
sendBtn.onclick = sendMsg;

function joinChat() {
    myName = nameInput.value.trim() || "Névtelen";
    nameScreen.style.display = "none";
    chatScreen.style.display = "flex";
    chatInputBox.style.display = "flex";

    socket = io();
    socket.emit("setName", myName);

    socket.on("systemMessage", msg => addSystemMessage(msg));
    socket.on("chatMessage", data => addMessage(data.name, data.text));

    chatInput.focus();
}

function sendMsg() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Kliens oldali hozzáadás (kék)
    addMessage(myName, text, true);

    socket.emit("chatMessage", text);
    chatInput.value = "";
    chatInput.focus();
}

function addMessage(name, text, isYou = false) {
    const div = document.createElement("div");
    div.classList.add("msg", isYou ? "you" : "other");
    div.innerHTML = `<strong>${name}:</strong> ${escapeHtml(text)}`;
    chatMessages.appendChild(div);
    scrollChat();
}

function addSystemMessage(text) {
    const div = document.createElement("div");
    div.classList.add("system");
    div.textContent = text;
    chatMessages.appendChild(div);
    scrollChat();
}

function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Egyszerű HTML escape, hogy ne lehessen scriptet beszúrni
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
        return {
            '&': "&amp;",
            '<': "&lt;",
            '>': "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[m];
    });
}
