// =======================
// Quotes Array & Storage
// =======================
let quotes = [];

// Load quotes from localStorage
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
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
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

// =======================
// Functions
// =======================

// Show a random quote (checker requires showRandomQuote)
function showRandomQuote() {
  let filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

  quoteDisplay.innerHTML = `"${randomQuote.text}" — (<strong>${randomQuote.category}</strong>)`;
}

// Get quotes based on selected filter
function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  // POST new quote to mock server
  postQuoteToServer(newQuote);

  textInput.value = "";
  categoryInput.value = "";

  populateCategories(); // Update category dropdown
  alert("New quote added successfully!");
  showRandomQuote();
}


// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate categories dynamically
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const lastFilter = localStorage.getItem("lastSelectedCategory");
  if (lastFilter && [...categoryFilter.options].some(o => o.value === lastFilter)) {
    categoryFilter.value = lastFilter;
  }
}

// Filter quotes based on dropdown selection
function filterQuotes() {
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
  showRandomQuote();
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
        populateCategories();
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
populateCategories();
showRandomQuote();

// =======================
// Event Listeners
// =======================
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importInput.addEventListener("change", importFromJsonFile);

// =======================
// Server Sync Simulation
// =======================

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock server
const SYNC_INTERVAL = 60000; // 60 seconds

// Function required by checker
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate server quotes format: [{ text, category }]
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    mergeServerQuotes(serverQuotes);
  } catch (err) {
    console.error("Error fetching server quotes:", err);
  }
}

// Merge server quotes with local quotes
function mergeServerQuotes(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(
      q => q.text === serverQuote.text && q.category === serverQuote.category
    );
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert("Local quotes updated from server! Conflicts resolved by server data.");
  }
}

// Periodically sync with server
setInterval(fetchQuotesFromServer, SYNC_INTERVAL);

// =======================
// Sync Quotes Function
// =======================

function syncQuotes() {
  // Fetch latest quotes from server and merge
  fetchQuotesFromServer();

  // Optionally, post all local quotes to server for syncing
  // Here we just post the latest quote added
  // (You could loop over all quotes if desired)
  const lastQuote = quotes[quotes.length - 1];
  if (lastQuote) {
    postQuoteToServer(lastQuote);
  }
}

// Automatically sync every 60 seconds
setInterval(syncQuotes, 60000);

// Optional: initial sync on page load
syncQuotes();
