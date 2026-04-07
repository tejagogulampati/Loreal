const WORKER_URL = "https://loreal.gogulampativenkatatejacollege.workers.dev";

async function generateRoutine() {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "routine",
      products: selected
    })
  });

  const data = await res.json();

  console.log("AI RESPONSE:", data);

  document.getElementById("chat").innerHTML += `
    <p><b>AI:</b> ${data.reply}</p>
  `;
}