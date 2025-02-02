// Existing quotes array
let quotes = [
    { text: "Quote 1", category: "Inspirational" },
    { text: "Quote 2", category: "Motivational" },
    // ...
    ];
    
    // Function to show a random quote
    async function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = randomQuote.text;
    quoteDisplay.appendChild(p);
    }
    
    // Function to populate categories dynamically
    function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
    });
    }
    
    // Function to filter quotes based on selected category
    function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";
    filteredQuotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = quote.text;
    quoteDisplay.appendChild(p);
    });
    // Save the last selected filter in local storage
    localStorage.setItem("lastFilter", selectedCategory);
    }
    
    // Function to add a new quote
    async function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    // Update the categories dropdown if a new category is introduced
    populateCategories();
    // Save the updated quotes array in local storage
    localStorage.setItem("quotes", JSON.stringify(quotes));
    filterQuotes();
    // Send a POST request to the server to add the new quote
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify(newQuote)
    });
    const data = await response.json();
    console.log(data);
    }
    }
    
    // Function to create the add quote form
    function createAddQuoteForm() {
    const addQuoteForm = document.getElementById("addQuoteForm");
    addQuoteForm.innerHTML = <label for="newQuoteText">Quote:</label> <input type="text" id="newQuoteText" name="newQuoteText"><br><br> <label for="newQuoteCategory">Category:</label> <input type="text" id="newQuoteCategory" name="newQuoteCategory"><br><br> <button onclick="addQuote()">Add Quote</button>;
    }
    
    // Function to export quotes as a JSON file
    function exportQuotes() {
    const quotesJSON = JSON.stringify(quotes);
    const blob = new Blob([quotesJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    }
    
    // Function to read quotes from a file
    function readQuotesFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
    const fileContent = event.target.result;
    const quotesFromFile = JSON.parse(fileContent);
    quotes = quotesFromFile;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    filterQuotes();
    };
    reader.readAsText(file);
    }
    
    // Function to fetch quotes from server
    async function fetchQuotesFromServer() {
    try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    quotes = data;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    filterQuotes();
    alert("Quotes synced with server!");
    } catch (error) {
    console.error("Error:", error);
    }
    }
    
    // Function to sync quotes with local storage
    function syncQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
    filterQuotes();
    }
    }
    
    // Function to update quotes at regular intervals
    function updateQuotesRegularly() {
    setInterval(async function() {
    await fetchQuotesFromServer();
    }, 60000); // Update quotes every 60 seconds
    }
    
    // Load quotes from local storage on page load
    document.addEventListener("DOMContentLoaded", function() {
    syncQuotes();
    populateCategories();
    const lastFilter = localStorage.getItem("lastFilter");
    if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter;
    filterQuotes();
    }
    showRandomQuote();
    createAddQuoteForm();
    updateQuotesRegularly();
    });
    
    // Add event listeners
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    document.getElementById("addQuote").addEventListener
