/**
 * Array of tasks
 * @type {Array}
 */
let tasks = [];

/**
 * Key to save in remote storage
 * @type {string}
 */
const remoteStorageKeyTest = 'board';

/**
 * Index of the current editing task.
 * @type {number}
 */
let currentEditingIndex = -1;

/**
 * Current dragged element. 
 * @type {object}
 */
let currentDraggedElement;

/**
 * Loads the tasks and contact from the remote storage an renders it. 
 */
async function loadBoard() {
  tasks = await getBoardFromRemoteStorage();
  await getContactsFromRemoteStorage();
  updateHTML();
}

/**
 * Saves the task from the board to the remote storage. 
 */
async function setBoardToRemoteStorage() {
  try {
    await setItem(remoteStorageKeyTest, JSON.stringify(tasks));
  } catch (error) {
    console.warn(error);
  }
}

/**
 * Loads the tasks from the remote storage
 */
async function getBoardFromRemoteStorage() {
  try {
    const response = await getItem(remoteStorageKeyTest);
    return JSON.parse(response);
  } catch (error) {
    console.warn(error);
    return [];
  }
}

/**
 * Refreshs the board
 */
function updateHTML() {
  showToDoBoard();
  showInProgressBoard();
  showAwaitingFeedbackBoard();
  showDoneBoard();
}

/**‚
 * Filters the tasks if something is entered in search field. 
 */
function filterTasks() {
  /**
   * The search string.
   * @type {string}
   */
  let search = document.getElementById('searchInputField').value.toLowerCase();

  /**
   * the filtered tasks.
   * @type {Array}
   */
  let filteredTasks = tasks.filter(task => {
    const title = task.title.toLowerCase();
    const description = task.description.toLowerCase();
    return title.includes(search) || description.includes(search);
  });
  showFilteredTasks(filteredTasks);
}


/**
 * Shows the filtered tasks on the board. 
 * @param {Array} filteredTasks - filtered tasks. 
 */
function showFilteredTasks(filteredTasks) {
  document.getElementById('to-do').innerHTML = '';
  document.getElementById('in-progress').innerHTML = '';
  document.getElementById('awaiting-feedback').innerHTML = '';
  document.getElementById('done').innerHTML = '';

  filteredTasks.forEach(task => {
    const element = generateTodoHTML(task);
    const kanban = task.kanban;
    document.getElementById(kanban).innerHTML += element;
  });
}

/**
 * Opens the selected task
 * @param {string} elementId - ID of the element.
 */
function openTask(elementId) {
  let currentTask = document.getElementById('edit-task');
  let kanban = document.getElementById('kanban-board');

  let date = new Date("July 21");

  // Search Task by ID
  const element = tasks.find(task => task.id === elementId);

  currentTask.innerHTML = ``;
  currentTask.innerHTML = openTaskHTML(element, date);

  currentTask.classList.remove('d-none');
  kanban.classList.add('blur');
}

/**
 * Changes the status of a substask.
 * @param {string} elementId -  ID of the task.
 * @param {string} subtask - subtask.
 * @param {boolean} isChecked - selected status.
 */
function changeSubtaskStatus(elementId, subtask, isChecked) {
  let findtask = tasks.find(task => task.id === elementId); // Search task by ID
  let findsubtask = findtask.subtasks.find(task => task === subtask); // seach subtask in finded task.
  let position = findtask.subtasks.indexOf(findsubtask); // get position of subtask

  if (isChecked) {
    findtask.subtaskStatus[position] = true; 
  } else {
    findtask.subtaskStatus[position] = false;
  }

  setBoardToRemoteStorage();
  updateHTML();
}


/**
 * Closes a openend Task. 
 */
function closeTask() {
  let currentTask = document.getElementById('edit-task');
  currentTask.classList.add('d-none');
  let kanban = document.getElementById('kanban-board');
  kanban.classList.remove('blur');
}


/**
 * Deletes the current Task
 * @param {string} id -  ID of the Task.
 */
function deleteTask(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    setBoardToRemoteStorage();
    closeTask();
    updateHTML();
  }
}

/**
 * Edit Task
 * @param {string} id - ID of Task that should be edited.
 */
function editTask(id) {
  let currentTask = document.getElementById('edit-task');
  currentTask.innerHTML = '';

  const element = tasks.find(task => task.id === id);

  currentTask.innerHTML = editTaskHTML(element);
  currentEditingIndex = tasks.findIndex(task => task.id === id);
}


/**
 * Das Zuweisen der Kontakte für die jeweilige Aufgabe.
 */
function updateAssignedContacts() {
  // Erstelle ein leeres Array, um zugewiesene Kontakte zu speichern
  const assignedContacts = [];

  // Wähle alle ausgewählten Checkbox-Elemente aus
  const assignedCheckboxElements = document.querySelectorAll('input[type="checkbox"]:checked');

  // Iteriere über jedes ausgewählte Checkbox-Element
  assignedCheckboxElements.forEach((checkbox) => {
    // Extrahiere den Index des Kontakts aus der ID der Checkbox
    const contactIndex = parseInt(checkbox.id.split('-')[1]);

    // Füge den entsprechenden Kontakt zum zugewiesenen Kontakte-Array hinzu
    assignedContacts.push(contacts[contactIndex]);
  });

  // Aktualisiere die 'assigned'-Eigenschaft des aktuellen bearbeiteten Tasks mit den zugewiesenen Kontakten
  tasks[currentEditingIndex].assigned = assignedContacts;
}


/**
 * Speichert die Aufgabe, nachdem sie bearbeitet wurde.
 */
function saveChanges() {
 
  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;
  const dueDate = document.getElementById('dateInput').value;

  // Überprüfe, ob der Index gültig ist
  if (currentEditingIndex >= 0 && currentEditingIndex < tasks.length) {
    tasks[currentEditingIndex].title = title;
    tasks[currentEditingIndex].description = description;
    tasks[currentEditingIndex].dueDate = dueDate;
  }
  updateAssignedContacts();
  setBoardToRemoteStorage();
  updateHTML();
  closeTask();
  savedChangesReport();
}



/**
 * Setzt die Priorität auf "dringend".
 */
function priorityUrgent() {
  document.getElementById('buttonUrgent').classList.add('urgent-background');
  document.getElementById('urgent-image').src = "../img/urgent-symbol.png";
  document.getElementById('buttonMedium').classList.remove('medium-background');
  document.getElementById('medium-image').src = "../img/priority-medium.png";
  document.getElementById('buttonLow').classList.remove('low-background');
  document.getElementById('low-image').src = "../img/priority-low.png";
  tasks[currentEditingIndex].priority = 'urgent';
}


/**
 * Setzt die Priorität auf "mittel".
 */
function priorityMedium() {
  document.getElementById('buttonMedium').classList.add('medium-background');
  document.getElementById('medium-image').src = "../img/medium-symbol.svg";
  document.getElementById('buttonUrgent').classList.remove('urgent-background');
  document.getElementById('urgent-image').src = "../img/priority-urgent.png";
  document.getElementById('buttonLow').classList.remove('low-background');
  document.getElementById('low-image').src = "../img/priority-low.png";
  tasks[currentEditingIndex].priority = 'medium';
}


/**
 * Setzt die Priorität auf "niedrig".
 */
function priorityLow() {
  document.getElementById('buttonLow').classList.add('low-background');
  document.getElementById('low-image').src = "../img/low-symbol.svg";
  document.getElementById('buttonUrgent').classList.remove('urgent-background');
  document.getElementById('urgent-image').src = "../img/priority-urgent.png";
  document.getElementById('buttonMedium').classList.remove('medium-background');
  document.getElementById('medium-image').src = "../img/priority-medium.png";
  tasks[currentEditingIndex].priority = 'low';
}



/**
 * Lässt die Aufgabe für den Drag-and-Drop-Vorgang vorbereitet werden.
 *
 * @param {string} id - Die ID der Aufgabe, die gezogen werden soll.
 */
function startDragging(id) {
  currentDraggedElement = tasks.find(task => task.id === id);
}

/**
 * Erlaubt den Drag-and-Drop-Vorgang.
 *
 * @param {Event} ev - Das Drag-and-Drop-Ereignisobjekt.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Bewegt die gezogene Aufgabe in ein bestimmtes Kanban-Board.
 *
 * @param {string} kanban - Der Name des Kanban-Boards, in das die Aufgabe verschoben wird.
 */
function moveTo(kanban) {
  currentDraggedElement['kanban'] = kanban;
  setBoardToRemoteStorage();
  updateHTML();
}

/**
 * Hervorhebungsbereich für den Drag-and-Drop-Vorgang.
 *
 * @param {string} id - Die ID des Bereichs, der hervorgehoben werden soll.
 */
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Entfernt die Hervorhebung des Bereichs nach dem Drag-and-Drop-Vorgang.
 *
 * @param {string} id - Die ID des Bereichs, dessen Hervorhebung entfernt werden soll.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}



/**
 * Zeigt alle Aufgaben im 'To Do'-Board an.
 */
function showToDoBoard() {
  let toDo = tasks.filter(t => t['kanban'] == 'to-do');
  document.getElementById('to-do').innerHTML = '';
  for (let index = 0; index < toDo.length; index++) {
    let element = toDo[index];
    document.getElementById('to-do').innerHTML += generateTodoHTML(element);
  }
}

/**
 * Zeigt alle Aufgaben im 'In Progress'-Board an.
 */
function showInProgressBoard() {
  let inProgress = tasks.filter(t => t['kanban'] == 'in-progress');
  document.getElementById('in-progress').innerHTML = '';
  for (let index = 0; index < inProgress.length; index++) {
    let element = inProgress[index];
    document.getElementById('in-progress').innerHTML += generateTodoHTML(element);
  }
}

/**
 * Zeigt alle Aufgaben im 'Awaiting Feedback'-Board an.
 */
function showAwaitingFeedbackBoard() {
  let awaitingFeedback = tasks.filter(t => t['kanban'] == 'awaiting-feedback');
  document.getElementById('awaiting-feedback').innerHTML = '';
  for (let index = 0; index < awaitingFeedback.length; index++) {
    let element = awaitingFeedback[index];
    document.getElementById('awaiting-feedback').innerHTML += generateTodoHTML(element);
  }
}

/**
 * Zeigt alle Aufgaben im 'Done'-Board an.
 */
function showDoneBoard() {
  let done = tasks.filter(t => t['kanban'] == 'done');
  document.getElementById('done').innerHTML = '';
  for (let index = 0; index < done.length; index++) {
    let element = done[index];
    document.getElementById('done').innerHTML += generateTodoHTML(element);
  }
}


/**
 * Rückmeldung, dass eine Aufgabe umgeändert wurde.
 */
function savedChangesReport() {
  document.getElementById('savedChanges').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('savedChanges').classList.add('d-none');
  }, 2500); // Entfernt Meldung wieder nach 2 Sekunden.
}

