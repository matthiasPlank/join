/**
 * Array for assigned contacts
 * @type {Object[]} - new array for assigned contacts
 */
let assigned = []; 

/**
 * Loads tasks and contacts from the remote storage
 * @returns {Promise<void>}
 */
async function loadArray() {
  tasks = await getBoardFromRemoteStorage();
  await getContactsFromRemoteStorage();
  await loadContacts();
  setMinDateAttribute();
  priorityMediumAddTask();
}

/**
 * Creates a new Task
 */
async function createTask() {

  let inputValues = getValuesForCreateTask(); 

  let subtasks = [];
  setSubtasks(subtasks);
  let subtaskStatus = [];
  subtasks.forEach(() => {
    subtaskStatus.push(false); // Push false in das subtaskStatus-Array
  });

  let newTask = createNewTask(inputValues, assigned , subtasks, subtaskStatus); 
  tasks.push(newTask);

  setFieldsToStandard();
  resetPriority();
  setBoardToRemoteStorage();
  taskAddedReport();
}

/**
 * Creates an new Task Object with hand over parameters.
 * @param {String[]} inputValues 
 * @param {Object[]} assigned 
 * @param {String[]} subtasks 
 * @param {Boolean[]} subtaskStatus 
 * @returns 
 */
function createNewTask(inputValues, assigned , subtasks, subtaskStatus){
    /**
   * @type {Object}
   */
    let newTask = {
      id: generateUniqueId(),
      title: inputValues[0],
      description:  inputValues[1],
      category:  inputValues[2],
      dueDate:  inputValues[3],
      assigned: assigned,
      kanban: 'to-do',
      priority:  inputValues[4],
      subtasks: subtasks,
      subtaskStatus: subtaskStatus // Array mit false-Werten für Subtask-Status
    };
    return newTask; 
}

/**
 * Gets the values from the HTML Form to create a new Task an returns these parameters. 
 * @returns String[]
 */
function getValuesForCreateTask(){

  let title = document.getElementById('titleInputAddTask').value;
  let description = document.getElementById('descriptionInputAddTask').value;
  let category = document.getElementById('categoryInputAddTask').value;
  let dueDate = document.getElementById('dueDateInputAddTask').value;
 
  let priority = 'medium'; // Standardpriorität (falls nichts ausgewählt). 
  if (document.getElementById('buttonUrgentAddTask').classList.contains('urgent-background')) {
    priority = 'urgent';
  } else if (document.getElementById('buttonMediumAddTask').classList.contains('medium-background')) {
    priority = 'medium';
  } else if (document.getElementById('buttonLowAddTask').classList.contains('low-background')) {
    priority = 'low';
  }
  return [title, description, category, dueDate, priority]; 
}


/**
 * Get all subtasks from the HTML form an save it in an array für the task.
 * @param {String[]} subtasks - array for subtasks
 */
function setSubtasks(subtasks) {
  
  let subtaskElements = document.getElementsByClassName('subtask');
  for (let i = 0; i < subtaskElements.length; i++) {
    let subtask = subtaskElements[i].innerText.trim();
    subtasks.push(subtask);
  }
}


/**
 * Resets the inpute fields after a new task was created. 
 */
function setFieldsToStandard() {
  document.getElementById('titleInputAddTask').value = '';
  document.getElementById('descriptionInputAddTask').value = '';
  document.getElementById('categoryInputAddTask').value = '';
  document.getElementById('dueDateInputAddTask').value = '';
  document.getElementById('subtaskContainer').innerHTML = '';
}


/**
 * Resets the priority button after creating a new task. 
 */
function resetPriority() {
  document.getElementById('buttonUrgentAddTask').classList.remove('urgent-background');
  document.getElementById('buttonMediumAddTask').classList.remove('medium-background');
  document.getElementById('buttonLowAddTask').classList.remove('low-background');
}


/**
 * Shows a message after creating a new task. 
 */
function taskAddedReport() {
  document.getElementById('successMessage').classList.remove('d-none');
  setTimeout(function () {
    window.location.href = '../board/board.html';
  }, 1700); // Warte 1,7 Sekunden, bevor zur Board Ansicht weitergeleitet wird
}


/**
 * Add a new subtask
 */
function addSubtask() {

  let subtask = document.getElementById('subtaskInput').value;

  if (subtask === '') {
    alert('Please enter a subtask.');
  } else {
    let container = document.getElementById('subtaskContainer');
    container.innerHTML += `<label class="subtask"> <input type="checkbox"> ${subtask} </label>`;
    document.getElementById('subtaskInput').value = '';
  }
}


/**
 * Loads all contacts from the contactlist.
 */
function loadContacts() {
  let contactsField = document.getElementById('assignedCheckboxContainer');
  contactsField.innerHTML = '';

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    contactsField.innerHTML += `<label onclick="doNotClose(event)" class="label d-none"><input type="checkbox" onchange="handleContactCheckboxChange(this, ${i})"> ${contact['firstName']} ${contact['lastName']} </label>`;
  }
}

/**
 * Stops events for superior elements.
 * @param {event} event 
 */
function doNotClose(event){
    event.stopPropagation();
}

/**
 * Shows all contacts from the contactslist.
 */
function showContacts() {

  let labels = document.getElementsByClassName('label');
  let container = document.getElementById('selectContacts');

  if (container.classList.contains('bordernone') ? container.classList.remove('bordernone') : container.classList.add('bordernone') ) ; 

  for (let i = 0; i < labels.length; i++) {
    if (labels[i].classList.contains('d-none') ? labels[i].classList.remove('d-none') : labels[i].classList.add('d-none')); 
  }

  let contacts = document.getElementById('assignedCheckboxContainer');
  if (contacts.classList.contains('border-bottom') ? contacts.classList.remove('border-bottom') : contacts.classList.add('border-bottom') ) ;

}


/**
 * Add and removes the selected contacts for a task
 * @param {HTMLInputElement} checkbox - checkbox element
 * @param {number} index -  index of contact
 */
function handleContactCheckboxChange(checkbox, index) {
  let selectedContact = contacts[index];

  if (checkbox.checked) {
    assigned.push(selectedContact);
  } else {
    let contactIndex = assigned.findIndex((contact) => contact === selectedContact);
    assigned.splice(contactIndex, 1);
  }
}


/**
 * Updates the array of contacts. 
 * @param {Object} contact 
 */
function updateAssignedArray(contact) {
  let contactIndex = assigned.findIndex((assignedContact) => assignedContact === contact);
  if (contactIndex !== -1) {
    assigned.splice(contactIndex, 1);
  }
}


/**
 * Resets checkboxes after creating a new Task.
 */
function resetCheckboxes() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}


/**
 * Generates a uniqe ID. 
 * @returns {number} - uniqe ID
 */
function generateUniqueId() {
  var timestamp = new Date().getTime();
  var randomNum = Math.floor(Math.random() * 10000);
  var uniqueId = parseInt(timestamp.toString() + randomNum.toString());
  return uniqueId;
}


/**
 * Sets the priority to "urgent" for the creating Task. 
 */
function priorityUrgentAddTask() {
  document.getElementById('buttonUrgentAddTask').classList.add('urgent-background');
  document.getElementById('urgent-image').src = "../img/urgent-symbol.png";
  document.getElementById('buttonMediumAddTask').classList.remove('medium-background');
  document.getElementById('medium-image').src = "../img/priority-medium.png";
  document.getElementById('buttonLowAddTask').classList.remove('low-background');
  document.getElementById('low-image').src = "../img/priority-low.png";
}


/**
 *  Sets the priority to "medium" for the creating Task. 
 */
function priorityMediumAddTask() {
  document.getElementById('buttonMediumAddTask').classList.add('medium-background');
  document.getElementById('medium-image').src = "../img/medium-symbol.svg";
  document.getElementById('buttonUrgentAddTask').classList.remove('urgent-background');
  document.getElementById('urgent-image').src = "../img/priority-urgent.png";
  document.getElementById('buttonLowAddTask').classList.remove('low-background');
  document.getElementById('low-image').src = "../img/priority-low.png";
}


/**
* Sets the priority to "low" for the creating Task. 
*/
function priorityLowAddTask() {
  document.getElementById('buttonLowAddTask').classList.add('low-background');
  document.getElementById('low-image').src = "../img/low-symbol.svg";
  document.getElementById('buttonUrgentAddTask').classList.remove('urgent-background');
  document.getElementById('urgent-image').src = "../img/priority-urgent.png";
  document.getElementById('buttonMediumAddTask').classList.remove('medium-background');
  document.getElementById('medium-image').src = "../img/priority-medium.png";
}


/**
 * Sets a minumum date.
 */
function setMinDateAttribute() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  var nextyyyy = yyyy + 1; 

  if (dd < 10 ?  dd = '0' + dd : "" ); 
  if (mm < 10 ?  mm = '0' + mm : "" );                                                                           
   
  today = yyyy + '-' + mm + '-' + dd;
  const nextYear = nextyyyy + '-' + mm + '-' + dd;
  document.getElementById("dueDateInputAddTask").setAttribute("min", today);
  document.getElementById("dueDateInputAddTask").setAttribute("max", nextYear);
}

/**
 * Eventlistener für click event on document
 */
document.addEventListener('click', function(event) {
  let contactMenu = document.getElementById('selectContacts');
  let targetElement = event.target; // clicked element

  // Checks if clicked element is part of droptdown menu or menu is opened. 
  if (!contactMenu.contains(targetElement)) {

    contactMenu.classList.remove('bordernone');

    let labels = document.getElementsByClassName('label');
    for (let i = 0; i < labels.length; i++) {
      labels[i].classList.add('d-none');
    }
  }

});


/**
 * Evenetlistener for check "enter" key to add a new subtask
 */
document.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) { // ckecks, "enter-key" is pressed.
    if (document.activeElement.id == 'subtaskInput') {
      addSubtask(); 
      event.preventDefault(); 
    }
  }
});

/**
 * Reloads page
 */
function clearAddTaskForm(){
  window.location.reload();
}

/**
 * Sets dueDate to today
 */
function setTodayDate() {
  var today = new Date();
  var dueDateInput = document.getElementById('dueDateInputAddTask');
  dueDateInput.value = formatDate(today);
}

/**
 * Formats the handed over date. 
 * @param {date} date 
 * @returns String - Formated date
 */
function formatDate(date) {
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
}