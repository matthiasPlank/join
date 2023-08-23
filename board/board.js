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
  setMobileNavigationHighlighting("mobileTabBoard"); 
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
 * Hidden function to remove all Tasks 
 */
async function setClearBoardToRemoteStorage() {
  let emptyTasks = []; 
  try {
    await setItem(remoteStorageKeyTest, JSON.stringify(emptyTasks));
  } catch (error) {
    console.warn(error);
  }
}

/**
 * Hidden function to remove all tasks without a valid kanban entry
 */
async function clearBoardFromTaskWithoutKanban(){
  let newTasks = []; 
  tasks.forEach(task => {
    if(task.kanban === undefined){}
    else{
      newTasks.push(task); 
    }
  });
  tasks = newTasks; 
  setBoardToRemoteStorage(); 
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
  let kanban = document.getElementById('content');
  let blockerPanel = document.getElementById('blockerPanel');
  
  let date = new Date("July 21");

  // Search Task by ID
  const element = tasks.find(task => task.id === elementId);

  currentTask.innerHTML = ``;
  currentTask.innerHTML = openTaskHTML(element, date);

  currentTask.classList.remove('d-none');
  kanban.classList.add('blur');
  blockerPanel.classList.remove('d-none');
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
  let blockerPanel = document.getElementById('blockerPanel');
  currentTask.classList.add('d-none');
  let kanban = document.getElementById('content');
  kanban.classList.remove('blur');
  blockerPanel.classList.add('d-none');
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
  setEditTaskStatus(element); 
  currentEditingIndex = tasks.findIndex(task => task.id === id);
  setPriority(element.priority); 
}

/**
 * Sets the status dropdown in the edit mode of a task.
 * @param {Object} element - Task that should be edited.
 */
function setEditTaskStatus(element){
  
  let kanbanValue = element['kanban'];  
  let selectElement = document.getElementById("task-status-input");
  for (var i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value === kanbanValue) {
        selectElement.options[i].selected = true;
        break;
    }
  }
}

/**
 * Assigning the contacts for a task.
 */
function updateAssignedContacts() {

  const assignedContacts = [];
  const assignedCheckboxElements = document.querySelectorAll('input[type="checkbox"]:checked');

  assignedCheckboxElements.forEach((checkbox) => {
    const contactIndex = parseInt(checkbox.id.split('-')[1]);
    assignedContacts.push(contacts[contactIndex]);
  });

  tasks[currentEditingIndex].assigned = assignedContacts;
}

/**
 * Save the task after it has been edited.
 */
function saveChanges() {
 
  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;
  const dueDate = document.getElementById('dateInput').value;
  const status = document.getElementById("task-status-input").value;

  //Check if the index is valid
  if (currentEditingIndex >= 0 && currentEditingIndex < tasks.length) {
    tasks[currentEditingIndex].title = title;
    tasks[currentEditingIndex].description = description;
    tasks[currentEditingIndex].dueDate = dueDate;
    tasks[currentEditingIndex].kanban = status;
  }
  updateAssignedContacts();
  setBoardToRemoteStorage();
  updateHTML();
  closeTask();
  savedChangesReport();
}

/**
 * Sets the priority of the task to the given prio. 
 * @param {String} prio - priority of the task
 */
function setPriority(prio){
  resetPriorityStyle(); 
  const buttonElement = document.getElementById('button' + prio.charAt(0).toUpperCase() + prio.slice(1));
  const imageElement = document.getElementById(prio + '-image-edit');
  if (buttonElement && imageElement) { 
    const buttonClass = prio + '-background';
    buttonElement.classList.add(buttonClass);
    imageElement.src = "../img/" + prio + "-symbol.svg";
  } 
  tasks[currentEditingIndex].priority = prio;
}

/**
 * Clears the "aktive" Style from all prio buttons in edit Task from board. 
 */
function resetPriorityStyle(){
  document.getElementById('buttonUrgent').classList.remove('urgent-background');
  document.getElementById('urgent-image').src = "../img/priority-urgent.png";
  document.getElementById('buttonMedium').classList.remove('medium-background');
  document.getElementById('medium-image').src = "../img/priority-medium.png";
  document.getElementById('buttonLow').classList.remove('low-background');
  document.getElementById('low-image').src = "../img/priority-low.png";
}

/**
 * The task for the drag-and-drop process is prepared.
 * @param {string} id - The ID of the task that is to be drawn.
 */
function startDragging(id) {
  currentDraggedElement = tasks.find(task => task.id === id);
}

/**
 * Allows the drag-and-drop process.
 * @param {Event} ev - The drag-and-drop event object.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves the drawn task into a certain Kanban board.
 * @param {string} kanban - The name of the Kanban board, into which the task is postponed.
 */
function moveTo(kanban) {
  currentDraggedElement['kanban'] = kanban;
  setBoardToRemoteStorage();
  updateHTML();
}

/**
 * Figure area for the drag-and-drop process.
 * @param {string} id - The ID of the area that is to be emphasized. 
*/
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

/**
  * Removes the highlighting of the area according to the drag-and-drop process. 
  * @param {string} id - The ID of the area, the highlighting of which is to be removed.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Displays all tasks in the 'to do' board.
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
 * Displays all tasks in the 'Awaiting Feedback' board.
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
 * Displays all tasks in the 'Done' board.
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
 * Feedback that a task has been changed.
 */
function savedChangesReport() {
  document.getElementById('savedChanges').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('savedChanges').classList.add('d-none');
  }, 2500); // Removes the message again after 2,5 seconds.
}

