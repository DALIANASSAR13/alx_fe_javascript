// script.js

// Initial quotes array (text + category)
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspirational" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" },
  { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "teamwork" },
  { text: "The secret of getting ahead is getting started.", category: "inspirational" },
  { text: "Done is better than perfect.", category: "productivity" }
];

// References to DOM elements
const quoteTextEl = document.getElementById('quoteText');
const quoteCategoryEl = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');
const showAddFormBtn = document.getElementById('showAddForm');
const addQuoteContainer = document.getElementById('addQuoteContainer');

// Populate category dropdown based on current quotes
function populateCategories() {
  // get unique categories
  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();
  // clear current options except "All"
  categorySelect.innerHTML = '<option value="all">All</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(opt);
  });
}

// Show a random quote (respects selected category)
function showRandomQuote() {
  const selected = categorySelect.value; // 'all' or a category
  const pool = selected === 'all'
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (pool.length === 0) {
    quoteTextEl.textContent = "No quotes found for this category.";
    quoteCategoryEl.textContent = "";
    return;
  }

  const idx = Math.floor(Math.random() * pool.length);
  const q = pool[idx];
  quoteTextEl.textContent = q.text;
  quoteCategoryEl.textContent = `Category: ${q.category}`;
}

// Create the add-quote form in the DOM
function createAddQuoteForm() {
  addQuoteContainer.innerHTML = ''; // clear previous
  const wrapper = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';
  textInput.style.marginRight = '8px';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.style.marginRight = '8px';

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = 'Add Quote';

  // Feedback area
  const feedback = document.createElement('div');
  feedback.style.marginTop = '8px';
  feedback.style.fontSize = '0.9rem';

  addBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim().toLowerCase();

    if (!text) {
      feedback.textContent = 'Please enter a quote text.';
      return;
    }
    if (!category) {
      feedback.textContent = 'Please enter a category.';
      return;
    }

    // Add to quotes array
    quotes.push({ text, category });

    // Update categories dropdown
    populateCategories();

    // Clear inputs and show success
    textInput.value = '';
    categoryInput.value = '';
    feedback.textContent = 'Quote added successfully!';

    // Optionally show the newly added quote immediately
    quoteTextEl.textContent = text;
    quoteCategoryEl.textContent = `Category: ${category}`;
  });

  wrapper.appendChild(textInput);
  wrapper.appendChild(categoryInput);
  wrapper.appendChild(addBtn);
  wrapper.appendChild(feedback);

  addQuoteContainer.appendChild(wrapper);
}

// Toggle visibility of add-quote form
let addFormVisible = false;
function toggleAddForm() {
  addFormVisible = !addFormVisible;
  if (addFormVisible) {
    createAddQuoteForm();
    showAddFormBtn.textContent = 'Hide Add Form';
  } else {
    addQuoteContainer.innerHTML = '';
    showAddFormBtn.textContent = 'Add Quote';
  }
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
showAddFormBtn.addEventListener('click', toggleAddForm);

// When category changes, optionally show a quote from that category
categorySelect.addEventListener('change', () => {
  // Show random quote in that category automatically
  showRandomQuote();
});

// init
populateCategories();
showRandomQuote();
