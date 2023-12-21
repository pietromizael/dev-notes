// Elementos
const notesContainer = document.querySelector("#notes-container");
const addNotesBtn = document.querySelector("#add-note");
const noteInput = document.querySelector("#note-content");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#export-notes");

// Funções
function showNotes() {
  cleanNotes();

  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);

    notesContainer.appendChild(noteElement);
  });
}

function cleanNotes() {
  notesContainer.replaceChildren([]);
}

function addNote() {
  const notes = getNotes();

  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  noteInput.value = "";

  saveNote(notes);
}

function createNote(id, content, fixed) {
  const element = document.createElement("div");
  const textarea = document.createElement("textarea");
  const pinIcon = document.createElement("i");
  const deleteIcon = document.createElement("i");
  const duplicateIcon = document.createElement("i");

  element.classList.add("note");
  pinIcon.classList.add(...["fa-solid", "fa-thumbtack"]);
  deleteIcon.classList.add(...["fa-regular", "fa-x"]);
  duplicateIcon.classList.add(...["fa-solid", "fa-copy"]);

  textarea.value = content;
  textarea.placeholder = "Adicione algum texto...";

  element.appendChild(textarea);
  element.appendChild(pinIcon);
  element.appendChild(deleteIcon);
  element.appendChild(duplicateIcon);

  // Eventos do elemento
  element.querySelector(".fa-thumbtack").addEventListener("click", () => {
    toggleFixNote(id);
  });

  if (fixed) {
    element.classList.add("fixed");
  }

  element.querySelector(".fa-x").addEventListener("click", () => {
    deleteNote(id, element);
  });

  element.querySelector(".fa-copy").addEventListener("click", () => {
    duplicateNote(id);
  });

  element.querySelector("textarea").addEventListener("keyup", (e) => {
    const noteContent = e.target.value;

    updateNote(id, noteContent);
  });

  return element;
}

function generateId() {
  return Math.floor(Math.random() * 5000);
}

function toggleFixNote(id) {
  const notes = getNotes();

  const targetNotes = notes.filter((note) => note.id === id)[0];

  targetNotes.fixed = !targetNotes.fixed;

  saveNote(notes);

  showNotes();
}

function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id !== id);

  saveNote(notes);

  notesContainer.removeChild(element);
}

function duplicateNote(id) {
  const notes = getNotes();

  const targetNotes = notes.filter((note) => note.id === id)[0];

  const noteObject = {
    id: generateId(),
    content: targetNotes.content,
    fixed: false,
  };

  const noteElement = createNote(
    noteObject.id,
    noteObject.content,
    noteObject.fixed
  );

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  saveNote(notes);
}

function updateNote(id, newContent) {
  const notes = getNotes();

  const targetNotes = notes.filter((note) => note.id === id)[0];

  targetNotes.content = newContent;

  saveNote(notes);
}

// LocalStorage
function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return orderedNotes;
}

function saveNote(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function searchNotes(search) {
  const notes = getNotes();

  const targetNotes = notes.filter((note) => note.content.includes(search));

  if (search !== "") {
    cleanNotes();

    targetNotes.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });

    return;
  }

  cleanNotes();
  showNotes(notes);
}

function exportData() {
  const notes = getNotes();

  const csvStrings = [
    ["ID", "Contúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ].map((e) => e.join(",")).join("\n");

  const element = document.createElement("a");

  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvStrings)

  element.target = "_blank"

  element.download = "notes.csv"

  element.click()
}

// Eventos
addNotesBtn.addEventListener("click", () => addNote());

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  searchNotes(search);
});

noteInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

exportBtn.addEventListener("click", () => {
  exportData();
});

// Inicizalização
showNotes();