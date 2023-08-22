let contacts = [];
const remoteStorageKey = `contacts`;

/**
 * Initialization when calling the contact page. Load the contacts from backend and generate HTML code.
 */
async function loadContactList(){
    await getContactsFromRemoteStorage();
    renderContactList();
    setMobileNavigationHighlighting("mobileTabContacts"); 
}

/**
 * Create and display the contact list as HTML code.
 */
function renderContactList(){
    let letter = ""; 
    sortContact();
    document.getElementById("contactList").innerHTML = /*html*/ ``; 
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const firstLetter = contact.firstName.substring(0, 1).toUpperCase(); 
        const firstLetterLastName = contact.lastName.substring(0, 1).toUpperCase(); 
        if(letter != firstLetter) {
            letter = firstLetter; 
            generateContactListHTMLDivider(letter); 
        }
        generateContactHTMLTemplate(firstLetter , firstLetterLastName , contact.firstName , contact.lastName , contact.email , contact.bgIconColor, i); 
    }
}

/**
 * Generates the HTML template of the divider in the contactlist with a given letter.
 * @param {String} letter - Letter for divider
 */
function generateContactListHTMLDivider(letter){
    document.getElementById("contactList").innerHTML += /*html*/ `
                <div>
                    <h3 class="contactLetter">${letter}</h3>
                    <hr class="contactLetterDivider">
                </div>
    `; 
}

/**
 * Generate the HTML template for a contact in the contactlist. 
 * @param {String} firstLetter - first letter of the given name from the contact.
 * @param {String} firstLetterLastName - fist letter of the last name from the contact. 
 * @param {String} firstName - fist name of the contact. 
 * @param {String} lastName - last name of the contact. 
 * @param {String} email - email adress of the contact. 
 * @param {String} bgIconColor - color code from the background color of the contact icon. 
 * @param {number} i - index of the current iteration (contact). 
 */
function generateContactHTMLTemplate(firstLetter , firstLetterLastName , firstName , lastName , email , bgIconColor ,  i){
    document.getElementById("contactList").innerHTML += /*html*/ `
            <div id="contactListItem" class="contactListItem" onClick="openContactDetails(${i})">
                <div>
                    <div id="contactIcon${i}" class="contactIcon">${firstLetter}${firstLetterLastName}</div>
                </div>
                <div>
                    <h3 class="contactName">${firstName} ${lastName}</h3>
                    <a class="contactEmail" href= "mailto:${email}">${email}</a>
                </div>
            </div>
        `; 
        document.getElementById("contactIcon"+i).style.backgroundColor = bgIconColor; 
}

/**
 * Sorts contacts alphabetically.
 */
function sortContact(){
    contacts = contacts.sort((a, b) => {
        if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
          return -1;
        }
      });
}

/**
 * Create random background color for a concert and assign it.
 * @param {id} id - Position of contact in the array
 */
function setContactIconBackground(id){
    let color = Math.floor(Math.random()*16777215).toString(16);
    document.getElementById("contactIcon"+id).style.backgroundColor = "#"+color; 
} 

/**
 * Load contacts from backend/remotestorage.
 */
async function getContactsFromRemoteStorage(){
    let resp =  await getItem(remoteStorageKey);
    contacts = JSON.parse(resp); 
}

/**
 * Opening the selected contact.
 * @param {int} index -  Position of contact in the array
 */
function openContactDetails(index){
    if (window.matchMedia('screen and (max-width: 800px) ').matches) {
        openMobileVersion(index); 
    }
    let contact = contacts[index]; 
    const firstLetter = contact.firstName.substring(0, 1); 
    const firstLetterLastName = contact.lastName.substring(0, 1); 
    generateHTMLTemplateForOpenContactDetails(index , firstLetter , firstLetterLastName , contact.firstName , contact.lastName , contact.email , contact.tel , contact.bgIconColor); 
}

/**
 * Generate the HTML template for a opened contact. 
 * @param {number} index - index of the current iteration (contact). 
 * @param {*} firstLetter - first letter of the given name from the contact.
 * @param {*} firstLetterLastName - fist letter of the last name from the contact. 
 * @param {*} firstName - fist name of the contact. 
 * @param {*} lastName - last name of the contact. 
 * @param {*} email - email adress of the contact. 
 * @param {*} tel - phone number of the contact. 
 * @param {*} bgIconColor - color code from the background color of the contact icon. 
 */
function generateHTMLTemplateForOpenContactDetails(index , firstLetter , firstLetterLastName , firstName , lastName , email , tel , bgIconColor){
    document.getElementById("selectedContact").innerHTML = /*html*/  `
    <div>
        <div class="contactDetailsName">
            <div class="contactDetailsIcon" id="contactDetailsIcon${index}">${firstLetter}${firstLetterLastName}</div>
            <div>
                <h3>${firstName} ${lastName}</h3>
                <a onclick="addNewTask('to-do')">
                    <img class="contactDetailsNamePlusIcon" src="../img/plus-icon-blue.png" alt="PlusIcon">  
                    <span class="contactDetailsNamePlusText">Add Task</span>
                </a>
            </div>
        </div>
        <div class="contactDetailsConatctInfos">
            <h3>Contact Information</h3>
            <div class="contactDetailsConatctInfosEdit" onclick="editContact(${index})">
                <img  src="../img/edit-contact-icon.png" alt="">
                <h3>Edit contact</h3>
            </div>
        </div>
        <div  class="contactDetailsConatctMailTel">
            <h3>E-Mail</h3>
            <a class="contactEmail" href= "mailto:${email}">${email}</a>
        </div>
        <div  class="contactDetailsConatctMailTel">
            <h3>Phone</h3>
            <a class="contactEmail" href= "tel:${tel}">${tel}</a>
        </div>
    </div>
    `;
    document.getElementById("contactDetailsIcon"+index).style.backgroundColor = bgIconColor; 
}

/**
 * Create new contact. HTML viewed a new contact to create.
 */
function addNewContact(){
    document.getElementById("openContact").classList.remove("dsp-none");
    document.getElementById("body").classList.add("overflow-hidden"); 
    document.getElementById("openContact").classList.add("openContact"); 
    renderContactForm(); 
}

/**
 * Create the HTML code for creating a new contact.
 */
function renderContactForm(){
    document.getElementById("openContact").innerHTML = /*html*/ `
    <div class="contactOverlay">
        <div class="contactOverlayContentClose">
            <img onclick="closeContactOverlay()" src="../img/close-task.png" alt="cross">
        </div>
        <div class="contactOverlaySideBar">
            <img src="../img/join-logo.png" alt="">
            <h1 id="contactOverlaySideBarTitle">Add contact</h1>
            <h2 id="contactOverlaySideBarSubtitle">Tasks are better with a team!</h2>
            <div class="blueStyleElem"></div>
        </div>
        <div class="contactOverlayContent">
            <div class="contactOverlayContentView">
                <form id="contactOverlayForm" onsubmit="addContact();return false">
                    <div class="contactOverlayContentMain">
                        <div>
                            <img class="contactOverlayContentIcon" src="../img/profil-icon-white.png" alt="profilIcon">
                       </div>
                        <div class="contactOverlayContentInputs">
                            <input required class="backgroundName" id="contactOverlayName" placeholder="Name" type="text">
                            <input required class="backgroundMail" id="contactOverlayEmail" placeholder="Email" type="email">
                            <input required class="backgroundTel" id="contactOverlayPhone" placeholder="Phone" type="tel">
                        </div>
                    </div>
                    <div class="contactOverlayButtons">
                        <button id="contactOverlayCancleButton" onclick="closeContactOverlay()" type="button" class="buttonWhite">
                            <h3 id="contactOverlayCancleButtonText">Cancel</h3>
                            <img src="../img/cross-icon.png" alt=""> 
                        </button>
                        <button id="contactOverlaySubmitButton" class="buttonBlue" type="submit">
                            <h3 id="contactOverlaySubmitButtonText">Create contact</h3>
                            <img src="../img/checkmark-only-icon.png" alt=""> 
                        </button>
                    </div>
                </form>
            </div>        
        </div>
    </div>
    `;
}

/**
 * Create new contact. Creating a new contact, save it in the 
 * remote sorage and update of the HTML surface.
 */
function addContact(){
    let name = document.getElementById("contactOverlayName").value ; 
    let email = document.getElementById("contactOverlayEmail").value ; 
    let phone = document.getElementById("contactOverlayPhone").value ; 
    let fullName = name.split(' '); 
    let firstName = fullName[0];
    let lastName = fullName[1];
    if ( lastName == undefined ? lastName = "" : ""); 
    let bgColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    contacts.push({ "firstName": `${firstName}`,"lastName": `${lastName}`,"email": `${email}`,"tel": `${phone}`,"bgIconColor": `${bgColor}`}); 

    setContactsToRemoteStorage(); 
    closeContactOverlay(); 
    renderContactList(); 
}

/**
 * Saving the contacts in the remoter storage/backend.
 */
function setContactsToRemoteStorage(){
    let resp = setItem(remoteStorageKey , JSON.stringify(contacts)); 
}

/**
 * Closing a contact in the mobile view.
 */
function closeContactOverlay(){
    document.getElementById("openContact").classList.add("dsp-none");
    document.getElementById("body").classList.remove("overflow-hidden"); 
    document.getElementById("openContact").classList.remove("openContact"); 
}

/**
 * Open a contact to edit.
 * @param {int} index -Position of contact in the array
 */
function editContact(index){
    document.getElementById("openContact").classList.remove("dsp-none");
    document.getElementById("openContact").classList.add("openContact"); 
    renderContactForm(); 
    document.getElementById("contactOverlaySideBarTitle").innerHTML = "Edit contact"; 
    document.getElementById("contactOverlaySideBarSubtitle").innerHTML = ""; 
    document.getElementById("contactOverlayName").value = contacts[index].firstName + " " + contacts[index].lastName; 
    document.getElementById("contactOverlayEmail").value = contacts[index].email; 
    document.getElementById("contactOverlayPhone").value = contacts[index].tel; 
    document.getElementById("contactOverlaySubmitButtonText").innerHTML = "Save"; 
    document.getElementById("contactOverlayForm").onsubmit = function() {saveEditedContact(index)};
    document.getElementById("contactOverlayCancleButton").onclick = function() {deleteEditedContact(index)};
    document.getElementById("contactOverlayCancleButtonText").innerHTML = "Delete"; 
}

/**
 * Saving an edited contact.
 * @param {int} index -  Position of contact in the array
 */
function saveEditedContact(index){
    let name = document.getElementById("contactOverlayName").value ; 
    let fullName = name.split(' '); 
    let firstName = fullName[0];
    let lastName = fullName[1];
    contacts[index].firstName = firstName; 
    contacts[index].lastName = lastName; 
    contacts[index].email = document.getElementById("contactOverlayEmail").value ; 
    contacts[index].tel = document.getElementById("contactOverlayPhone").value ; 
    setContactsToRemoteStorage(); 
    closeContactOverlay(); 
    renderContactList(); 
} 

/**
 * Delete a contact in edit mode.
 * @param {int} index - Position of the contact in the array
 */
function deleteEditedContact(index){
    contacts.splice(index, 1); 
    setContactsToRemoteStorage(); 
    closeContactOverlay(); 
    renderContactList(); 
    location.reload();
}

/**
 * Opens a contact in mobile view.
 * @param {int} index - Position of the contact in the array
 */
function openMobileVersion(index){
    document.getElementById("contactList").classList.add("dsp-none");
    document.getElementById("newContactBtn").classList.add("dsp-none");
    document.getElementById("mobileAddButton").classList.add("dsp-none");
    document.getElementById("contactDetail").style.display = "flex";
    document.getElementById("mobileProjectInfo").style.setProperty('display', 'flex', 'important');
    document.getElementById("mobileButtons").style.display = "flex";
    document.getElementById("mobileDeleteBtn").onclick = function() {deleteMobile(index)};
    document.getElementById("mobileEditBtn").onclick = function() {editMobile(index)};
}

/**
 * Deletes a selected contact in mobile view.
 * @param {int} index - Position of contact in the array
 */
function deleteMobile(index){
    deleteEditedContact(index); 
    location.reload();
}

/**
 * Opens the Edit interface in the mobile view
 * @param {int} index - Position of contact in the array
 */
function editMobile(index){
    document.getElementById("mobileEditBtn").classList.add("dsp-none");
    document.getElementById("mobileDeleteBtn").classList.add("dsp-none");
    editContact(index);
}

/**
 * Opens the AddTask overlay.
 */
async function addNewTask(status){
    await getContactsFromRemoteStorage();
    await loadContacts();
    await showContacts();
    setMinDateAttribute();
    priorityMediumAddTask();
    document.getElementById("addNewTask").classList.remove("dsp-none"); 
    document.getElementById("addNewTaskForm").setAttribute("onsubmit", "createTask('" + status + "');return false");
}

/**
 * Closes the Addtask overlay.
 */
function closeAddNewTask(){
    document.getElementById("addNewTask").classList.add("dsp-none"); 
}