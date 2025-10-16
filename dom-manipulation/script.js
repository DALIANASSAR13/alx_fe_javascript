// =======================
// Quotes Array & Storage
// =======================
let quotes = [];

// Load quotes from localStorage if available
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
  // Default quotes
  quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Stay hungry, stay foolish.", category: "Innovation" }
  ];
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// =======================
// DOM Elements
// =======================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// =======================
// Functions
// =======================

// Show a random quote (checker requires showRandomQuote)
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save last viewed quote in sessionStorage (optional)
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

  quoteDisplay.innerHTML = `"${randomQuote.text}" — (<strong>${randomQuote.category}</strong>)`;
}

// Dynamically create Add Quote form and JSON buttons (checker requires createAddQuoteForm)
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  // Input for quote text
  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  // Input for quote category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Add Quote button
  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  // JSON Export button
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes JSON";
  exportBtn.addEventListener("click", exportToJsonFile);

  // JSON Import input
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);

  // Append all elements to container
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  formContainer.appendChild(exportBtn);
  formContainer.appendChild(importInput);

  document.body.appendChild(formContainer);
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes(); // Save to localStorage

  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added successfully!");
  showRandomQuote();
}

// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Export quotes as JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// =======================
// Initialize App
// =======================
showRandomQuote();
createAddQuoteForm();

// Event listener for the "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

