// Struktur Data Buku
// [
//     {
//         id: string | number,
//         title: string,
//         author: string,
//         year: number,
//         isCompleted: boolean,
//       }
// ]

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// Check local storage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsedData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsedData);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const loadData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(loadData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const bookTitle = document.createElement("h3");
  bookTitle.classList.add("title-book");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("mt-0");
  bookAuthor.classList.add("mb-0");
  bookAuthor.innerText = "Penulis : " + author;

  const bookYear = document.createElement("p");
  bookYear.innerText = "Tahun : " + year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("p-1");
  buttonContainer.classList.add("mb-2");

  const wrapBookList = document.createElement("article");
  wrapBookList.classList.add("my-4");
  wrapBookList.classList.add("bg-warning");
  wrapBookList.classList.add("border");
  wrapBookList.classList.add("border-warning");
  wrapBookList.classList.add("rounded");
  wrapBookList.classList.add("text-center");
  wrapBookList.classList.add("p-2");
  wrapBookList.append(bookTitle, bookAuthor, bookYear, buttonContainer);
  wrapBookList.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const incompletedButton = document.createElement("button");
    incompletedButton.classList.add("btn");
    incompletedButton.classList.add("btn-success");
    incompletedButton.classList.add("me-3");
    incompletedButton.innerText = "Belum selesai dibaca";
    incompletedButton.addEventListener("click", function () {
      undoBookList(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-danger");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#exampleModal");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      removeBookList(id);
    });

    buttonContainer.append(incompletedButton, deleteButton);
  } else {
    const completedButton = document.createElement("button");
    completedButton.classList.add("btn");
    completedButton.classList.add("btn-success");
    completedButton.classList.add("me-3");
    completedButton.innerText = "Selesai dibaca";
    completedButton.addEventListener("click", function () {
      addBookToCompletedList(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-danger");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#exampleModal");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      removeBookList(id);
    });

    buttonContainer.append(completedButton, deleteButton);
  }

  return wrapBookList;
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const checkbox = document.getElementById("inputBookIsComplete");
  const generatedId = generateId();

  if (checkbox.checked) {
    const bookObject = generateBookObject(
      generatedId,
      bookTitle,
      bookAuthor,
      bookYear,
      true
    );
    books.push(bookObject);
  } else {
    const bookObject = generateBookObject(
      generatedId,
      bookTitle,
      bookAuthor,
      bookYear,
      false
    );
    books.push(bookObject);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompletedList(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookList(bookId) {
  const bookTarget = findBookIndex(bookId);
  const confirmToDelete = document.getElementById("confirmToDelete");
  confirmToDelete.addEventListener("click", function () {
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  });
}

function undoBookList(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("inputBook");

  submitBook.addEventListener("submit", function () {
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function search() {
  const searchBox = document.getElementById("searchBookTitle").value.toUpperCase();
  const container = document.getElementsByTagName("article");

  console.log(container);

  for (var i = 0; i < container.length; i++) {
    var name = container[i].getElementsByClassName("title-book");

    if (name[0].innerHTML.toUpperCase().indexOf(searchBox) > -1) {
      container[i].style.display = "block";
    } else {
      container[i].style.display = "none";
    }
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log("Data berhasil disimpan");
});

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBooksList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedBooksList = document.getElementById("completeBookshelfList");

  incompletedBooksList.innerHTML = "";
  completedBooksList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isCompleted) {
      completedBooksList.append(bookElement);
    } else {
      incompletedBooksList.append(bookElement);
    }
  }
});
