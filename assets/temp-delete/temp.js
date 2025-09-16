/**
 * Fetches the list of available books from /books/bookList.json
 * @returns {Promise<Array<{bookTitle:string, bookFilename:string}>>}
 */
async function getBookList() {
    try {
        const res = await fetch('/books/bookList.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid format: bookList.json must be an array");
        }

        const books = data.map(item => ({
            bookTitle: item.bookTitle,
            bookFilename: item.bookFilename
        }));

        // Debug: log the list so you can verify it loads correctly
        console.log("Book list loaded:", books);

        return books;
    } catch (err) {
        console.error("Failed to load book list:", err);
        return [];
    }
}

async function populateBooks() {
    bookSelect.innerHTML = '';

    // Use getBookList() instead of local books array
    const serverBooks = await getBookList();
    serverBooks.forEach((b, i) => {
        const o = document.createElement('option');
        o.value = i;
        o.textContent = b.bookTitle;
        bookSelect.appendChild(o);
    });

    bookSelect.value = currentBook;
    populateChapters();
}

window.onload = async () => {
    await populateBooks();
};

/**
 * Fetch a single book JSON file by filename.
 * @param {string} filename - The JSON filename (e.g., "learn_thai_basics.json")
 * @returns {Promise<Object>} - Resolves to the book object
 */
async function fetchBook(filename) {
    try {
        const response = await fetch(`/books/${filename}`);
        if (!response.ok) throw new Error(`Failed to fetch book: ${response.statusText}`);
        const bookData = await response.json();
        return bookData;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// Example usage:
fetchBook('learn_thai_basics.json').then(book => {
    if (book) {
        console.log('Book title:', book.bookTitle);
        console.log('Chapters:', book.chapters);
    }
});




/* -------------------------
           New function to get book list from server
           ------------------------- */
async function getBookList() {
    try {
        const resp = await fetch('/books/bookList.json');
        if (!resp.ok) throw new Error('Failed to fetch bookList.json');
        const data = await resp.json();
        // data should be an array of { bookTitle, bookFilename }
        return data;
    } catch (err) {
        console.error(err);
        return [];
    }
}

/* -------------------------
   Replaced populateBooks() function
   ------------------------- */
async function populateBooks() {
    const list = await getBookList();
    bookSelect.innerHTML = '';
    list.forEach((b, i) => {
        const o = document.createElement('option');
        o.value = i; // can be used to fetch bookFilename later
        o.textContent = b.bookTitle;
        bookSelect.appendChild(o);
    });
    bookSelect.value = 0;
    populateChapters();
}