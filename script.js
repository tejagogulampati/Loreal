const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* 🔗 PUT YOUR REAL WORKER URL */
const WORKER_URL = "https://YOUR-WORKER-NAME.workers.dev";

/* SYSTEM PROMPT */
let messages = [
  {
    role: "system",
    content: "You are a luxury L'Oréal Hair and Beauty Advisor. Give expert, stylish, and high-quality recommendations. Keep responses short and premium."
  }
];

/* WELCOME */
addMessage("Welcome. Ask about haircare, skincare, or beauty routines.", "ai");

/* ADD MESSAGE */
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("msg", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* SEND MESSAGE */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  addMessage("Typing...", "ai");

  messages.push({ role: "user", content: text });
  userInput.value = "";

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    console.log(data);

    const reply = data.choices?.[0]?.message?.content || "No response.";

    chatWindow.lastChild.remove();
    addMessage(reply, "ai");

    messages.push({ role: "assistant", content: reply });

  } catch (err) {
    chatWindow.lastChild.remove();
    addMessage("Connection error. Check backend.", "ai");
    console.error(err);
  }
});