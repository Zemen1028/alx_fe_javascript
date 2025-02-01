
        let quotes = JSON.parse(localStorage.getItem("quotes")) || [
            { text: "Believe you can and you're halfway there.", category: "Motivation" },
            { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
            { text: "Act as if what you do makes a difference. It does.", category: "Inspiration" }
        ];
        
        function saveQuotes() {
            localStorage.setItem("quotes", JSON.stringify(quotes));
        }
        
        function populateCategories() {
            const categorySet = new Set(quotes.map(q => q.category));
            const filterDropdown = document.getElementById("categoryFilter");
            filterDropdown.innerHTML = '<option value="all">All Categories</option>';
            categorySet.forEach(category => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                filterDropdown.appendChild(option);
            });
        }
        
        function showRandomQuote() {
            const selectedCategory = document.getElementById("categoryFilter").value;
            const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
            if (filteredQuotes.length > 0) {
                const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
                const selectedQuote = `${filteredQuotes[randomIndex].text} - (${filteredQuotes[randomIndex].category})`;
                document.getElementById("quoteDisplay").textContent = selectedQuote;
                sessionStorage.setItem("lastQuote", selectedQuote);
            } else {
                document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
            }
        }
        
        function filterQuotes() {
            localStorage.setItem("selectedCategory", document.getElementById("categoryFilter").value);
            showRandomQuote();
        }
        
        function addQuote() {
            const newQuoteText = document.getElementById("newQuoteText").value;
            const newQuoteCategory = document.getElementById("newQuoteCategory").value;
            
            if (newQuoteText && newQuoteCategory) {
                quotes.push({ text: newQuoteText, category: newQuoteCategory });
                saveQuotes();
                populateCategories();
                document.getElementById("newQuoteText").value = "";
                document.getElementById("newQuoteCategory").value = "";
                alert("Quote added successfully!");
            } else {
                alert("Please enter both a quote and a category.");
            }
        }
        
        function exportQuotes() {
            const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "quotes.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        function importFromJsonFile(event) {
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
                try {
                    const importedQuotes = JSON.parse(event.target.result);
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    populateCategories();
                    alert('Quotes imported successfully!');
                } catch (error) {
                    alert('Invalid JSON file.');
                }
            };
            fileReader.readAsText(event.target.files[0]);
        }
        
        async function syncWithServer() {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Mock API
                let serverQuotes = await response.json();
                
                if (serverQuotes.length > 0) {
                    quotes = serverQuotes.map(q => ({ text: q.title, category: "General" }));
                    saveQuotes();
                    populateCategories();
                    alert("Quotes synced with the server!");
                    document.getElementById("syncStatus").textContent = `Last Sync: ${new Date().toLocaleTimeString()}`;
                }
            } catch (error) {
                alert("Failed to sync with server.");
            }
        }
        
        document.getElementById("newQuote").addEventListener("click", showRandomQuote);
        
        if (sessionStorage.getItem("lastQuote")) {
            document.getElementById("quoteDisplay").textContent = sessionStorage.getItem("lastQuote");
        }
        
        populateCategories();
        document.getElementById("categoryFilter").value = localStorage.getItem("selectedCategory") || "all";
