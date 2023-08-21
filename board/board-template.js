/**
 * Generates the ToDo HTML Template for a given Task.
 * @param {Object} element - Task Object 
 * @returns HTML-Template for giveb Task
 */
function generateTodoHTML(element) {
    let contactsHTML = '';
    let remainingCount = 0;
    contactsHTML += generateContactsForTodoHTML(element); 
    if (remainingCount > 0 ? contactsHTML += `<div class="contactIcon" style="background-color: black;">+${remainingCount}</div>` : "" ); 
    let loadingBoxHTML = generateProgressForTodoHTML(element); 

    return `
    <div id="task-${element['id']}" onclick="openTask(${element['id']})" draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
        <div class="${element['category']} category">
            ${element['category']}
        </div>
        <div class="title">
            <b>${element['title']} </b>
        </div>
        <div class="description">
            ${element['description']} 
        </div>
        ${loadingBoxHTML}
        <div class="space-between">
            <div class="assigned">
                ${contactsHTML}
            </div>
            <div class="priorities">
                <img src="../img/priority-${element['priority']}.png">
          </div>
        </div>
    </div>`;
}

/**
 * Generates the contacts HTML part for ToDo HTML template. 
 * @param {Object} element - Task Object
 * @returns HTML contacts template for a given task
 */
function generateContactsForTodoHTML(element){
    let HTMLTemplate = ""; 
    for (let i = 0; i < element['assigned'].length; i++) {
        let contactFirstName = element['assigned'][i]['firstName'];
        let contactFirstNameLetter = contactFirstName.charAt(0);
        let contactLastName = element['assigned'][i]['lastName'];
        let contactLastNameLetter = contactLastName.charAt(0);
        let contactBackground = element['assigned'][i]['bgIconColor'];

        if (i < 3) {
            HTMLTemplate += `<div class="contactIcon" style="background-color: ${contactBackground};">${contactFirstNameLetter}${contactLastNameLetter}</div>`;
        } else {
            remainingCount++;
        }
    }
    return HTMLTemplate; 
}

/**
 * Generates the HTML prgressbar for a given task. 
 * @param {Object} element - Task Object
 * @returns HTML progressBar template for a given task
 */
function generateProgressForTodoHTML(element){
    let subtaskCount = element['subtasks'].length;
    let completedSubtasks = 0;

    if (Array.isArray(element['subtaskStatus'])) {
      completedSubtasks = element['subtaskStatus'].filter(status => status === true).length;
    }
    let progressPercentage = (completedSubtasks / subtaskCount) * 100;

    let loadingBoxHTML = '';
    if (subtaskCount > 0) {
        loadingBoxHTML = `
            <div id="loadingBox">
                <div class="loading-box">
                    <div class="ladebalken">
                        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <span id="subtaskCount">${completedSubtasks}/${subtaskCount} Done</span>
                </div>
            </div>
        `;
    }
    return loadingBoxHTML; 
}

/**
 * Generates the HTML Template for a opened Task.
 * @param {Object} element - Task
 * @returns HTML Template for a openend Task
 */
function openTaskHTML(element) {
    let contactsHTML = '';
    let subtasksHTML = '';

    contactsHTML += generateContactsForOpenTaskHTML(element); 
    subtasksHTML += generateSubtaksForOpenTaskHTML(element); 
      
    return `
    <div class="close-task">
        <img class="close-task-image" onclick="closeTask()" src="../img/close-task.png">
    </div>
    <div class="${element["category"]} category">
    ${element["category"]}
    </div>
    <div class="title">
        <h1>${element["title"]}</h1>
    </div>
    <div class="description">
        ${element["description"]} 
    </div>
    <div class="date">
        <b>Due date:</b>
        ${element["dueDate"]}
    </div>
    <div class="priorities">
        <b>Priority:</b> 
        <div class="${element["priority"]}">
            ${element["priority"]} <img src="../img/${element["priority"]}-symbol.svg">
        </div>
    </div>
    <div>
        <div class="assigned-to">
            <b> Assigned to: </b>
        </div>
        <div class="assigned">
            <div class="assigned-name">
                ${contactsHTML}
            </div>
        </div>
        <div class="subtask-list">
            <b> Subtasks: </b>
            <div class="subtask-list-container">
                ${subtasksHTML}
            </div>
        </div>
    </div>
    <div class="delete-edit-buttons">
        <button onclick="deleteTask(${element["id"]})" class="delete-button"></button>
        <button onclick="editTask(${element["id"]})" class="edit-button"><img src="../img/edit.png"></button>
    </div>
    </div>`;
}

/**
 * Generates the contacts HTML Template for the given Task. 
 * @param {Object} element - Task 
 * @returns 
 */
function generateContactsForOpenTaskHTML(element){
    let template = ""; 
    for (let i = 0; i < element['assigned'].length; i++) {

        let contactFirstName = element['assigned'][i]['firstName'];
        let contactFirstNameLetter = contactFirstName.charAt(0);
        let contactLastName = element['assigned'][i]['lastName']
        let contactLastNameLetter = contactLastName.charAt(0);
        let contactBackground = element['assigned'][i]['bgIconColor'];

        let icon = `<div class="contactIcon" style="background-color: ${contactBackground};">${contactFirstNameLetter}${contactLastNameLetter}</div>`;

        template += `
          <div class="contactsOnBoard"> ${icon} <div class="nameOfAssigned">${contactFirstName} ${contactLastName}</div> </div>
      `;
    }
    return template; 
}

/**
 * Generates the subtaks HTML Template for the given Task.
 * @param {Object} element -Task
 * @returns HTML Template
 */
function generateSubtaksForOpenTaskHTML(element){
    let template = ""; 
    for (let i = 0; i < element['subtasks'].length; i++) {
        let subtask = element['subtasks'][i];
        let checkboxId = `${element['id']}-checkbox-${i}`;
        let checkboxChecked = element.subtaskStatus[i] ? 'checked' : ''; // Überprüfen Sie den Zustand in subtaskStatus und legen Sie den Wert für "checked" fest
        template += `
          <label>
            <input id="${checkboxId}" type="checkbox" ${checkboxChecked} onchange="changeSubtaskStatus(${element['id']}, '${subtask}', this.checked)">
            ${subtask}
          </label>
        `;
      }
      return template; 
}


/**
 * Generates the HTML Template for a Task in edit mode.
 * @param {Object} element -Task
 * @returns HTML Template for a Task in edit mode. 
 */
function editTaskHTML(element) {

    let contactsHTML = generateContactsForEditTaskHTML(element); 

    return `
    <div class="edit-container">
        <div class="title-input">
            Title
            <input id="titleInput" value="${element["title"]}">
        </div>  
        <div class="description-input">
            Description
            <input id="descriptionInput" value="${element["description"]}">
        </div>
        <div class="date-input">
            Date
            <input type="date" id="dateInput" value="${element["dueDate"]}">
        </div>
        <div class="status-input">
            Status
            <select id="task-status-input">
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="awaiting-feedback">Awaiting Feedback</option>
                <option value="done">Done</option>
            </select>
        </div>
        <div class="priority-input">
            Prio
            <div class="edit-task-prio-buttons">
            <button id="buttonUrgent" onclick="priorityUrgent()"> Urgent <img id="urgent-image" src="../img/priority-urgent.png"></button>
            <button id="buttonMedium" onclick="priorityMedium()"> Medium <img id="medium-image" src="../img/priority-medium.png"></button>
            <button id="buttonLow" onclick="priorityLow()"> Low <img id="low-image" src="../img/priority-low.png"></button>
            </div>
        </div>
        <div class="assigned-box">
            <span class="assigned-to-span">
                Assigned to:
            </span>
            <div id="generateContactsHTML">
                ${contactsHTML}
            </div>
        </div>
        <div class="save-changes-button-container">
            <button class="save-changes-button" onclick="saveChanges()"> <span> Ok </span> <img src="../img/checkmark-only-icon.png"> </button>
        </div>
    </div>`;
}

/**
 * Generates the HTML template for the contacts in the task form in edit mode. 
 * @param {Object} element - Task
 * @returns HTML Template for the given task.
 */
function generateContactsForEditTaskHTML(element){
    let template = ""; 
    for (let i = 0; i < contacts.length; i++) {
        let contactFirstName = contacts[i]['firstName'];
        let contactLastName = contacts[i]['lastName'];
        let assigned = false;

        // Check if the Contact is assigned to the Task. 
        for (let j = 0; j < element['assigned'].length; j++) {
            if (contactFirstName === element['assigned'][j]['firstName']) {
                assigned = true;
                break;
            }
        }
        template +=  `<div class="contactsOnBoard"><label>`; 
        if(assigned ?  template += `<input type="checkbox" id="contactCheckbox-${i}" checked> ${contactFirstName} ${contactLastName}` :   template += `<input type="checkbox" id="contactCheckbox-${i}"> ${contactFirstName} ${contactLastName}`); 
        template += `</label></div>`; 
    }
    return template; 
    
}

