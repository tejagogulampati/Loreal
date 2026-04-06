const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

// IMPORTANT: this works with Cloudflare Pages Functions
const API_URL = "/api/chat";

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  addMessage("Typing...", "bot");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a L'Oréal beauty expert. Only answer skincare, haircare, makeup questions in a luxury tone."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await res.json();

    // remove "Typing..."
    chatBox.lastChild.remove();

    const reply = data.choices?.[0]?.message?.content || "No response";

    addMessage(reply, "bot");

  } catch (error) {
    chatBox.lastChild.remove();
    addMessage("Connection error. Check backend.", "bot");
    console.log(error);
  }
});