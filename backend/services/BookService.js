class BookService {
  constructor() {
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
    console.log(`${book.title} added.`);
  }

  getBooks() {
    return this.books;
  }

  reserveBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book && book.available) {
      book.available = false;
      console.log(`${book.title} reserved.`);
      return true;
    }
    return false;
  }

  cancelReservation(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book && !book.available) {
      book.available = true;
      console.log(`${book.title} reservation cancelled.`);
      return true;
    }
    return false;
  }
}

module.exports = BookService;
