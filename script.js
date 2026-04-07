let products = [];
let selectedProducts = JSON.parse(localStorage.getItem("selected")) || [];
let chatHistory = [];

const grid = document.getElementById("productGrid");
const selectedBox = document.getElementById("selectedProducts");
const chatBox = document.getElementById("chatBox");

async function loadProducts() {
  const res = await fetch("products.json");
  products = await res.json();
  displayProducts(products);
  updateSelectedUI();
}

function displayProducts(list) {
  grid.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    if (selectedProducts.find(x => x.id === p.id)) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.brand}</p>
      <p>${p.description}</p>
    `;

    card.onclick = () => toggleProduct(p);

    grid.appendChild(card);
  });
}

function toggleProduct(product) {
  const exists = selectedProducts.find(p => p.id === product.id);

  if (exists) {
    selectedProducts = selectedProducts.filter(p => p.id !== product.id);
  } else {
    selectedProducts.push(product);
  }

  localStorage.setItem("selected", JSON.stringify(selectedProducts));

  updateSelectedUI();
  displayProducts(products);
}

function updateSelectedUI() {
  selectedBox.innerHTML = "";

  selectedProducts.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${p.name}
      <button onclick="removeProduct(${p.id})">x</button>
    `;
    selectedBox.appendChild(div);
  });
}

function removeProduct(id) {
  selectedProducts = selectedProducts.filter(p => p.id !== id);
  localStorage.setItem("selected", JSON.stringify(selectedProducts));
  updateSelectedUI();
  displayProducts(products);
}

function clearAll() {
  selectedProducts = [];
  localStorage.removeItem("selected");
  updateSelectedUI();
  displayProducts(products);
}

async function generateRoutine() {
  const res = await fetch("https://loreal.gogulampativenkatatejacollege.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "routine",
      products: selectedProducts
    })
  });

  const data = await res.json();

  chatBox.innerHTML += `<div><b>AI Routine:</b><br>${data.reply}</div>`;
}

/* CHAT */
document.getElementById("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  chatBox.innerHTML += `<div><b>You:</b> ${msg}</div>`;
  input.value = "";

  chatHistory.push({ role: "user", content: msg });

  const res = await fetch("https://loreal.gogulampativenkatatejacollege.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "chat",
      message: msg,
      history: chatHistory
    })
  });

  const data = await res.json();

  chatHistory.push({ role: "assistant", content: data.reply });

  chatBox.innerHTML += `<div><b>AI:</b> ${data.reply}</div>`;
});

loadProducts();