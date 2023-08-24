let tasks = []; 
const taskremoteStorageKey = "board"; 
let mobileWelcomeShowed = false ; 


/**
 * Initialization and loading of the data from the backend. Called when opening the summary.
 */
async function loadTasks(){
    await getTasksFromLocalStorage(); 
    checkMobileLogin(); 
    setItemValues(); 
    LogInCheck();
}

/**
 * Sets the values ​​in the HTML interface.
 */
function setItemValues(){
    document.getElementById("tasksInBoard").innerHTML = tasks.length ; 
    document.getElementById("tasksInProgress").innerHTML = tasks.filter(task => task.kanban == "in-progress").length; 
    document.getElementById("tasksAwaitingFeedback").innerHTML = tasks.filter(task => task.kanban == "awaiting-feedback").length; 
    document.getElementById("tasksUrgent").innerHTML = tasks.filter(task => task.priority == "urgent").length;  
    document.getElementById("taskUrgentDate").innerHTML = getNextUrgentDate();  
    document.getElementById("tasksToDo").innerHTML = tasks.filter(task => task.kanban == "to-do").length; 
    document.getElementById("tasksDone").innerHTML = tasks.filter(task => task.kanban == "done").length; 
    setMobileNavigationHighlighting("mobileTabSummary"); 
    setMobileNavigationHighlighting("summaryNavTab"); 
}

/**
 * Checks which user was logged in and sets the name as a greeting in the HTML interface.
 */
function LogInCheck(){
  if (localStorage.getItem('username')) {
    let username = localStorage.getItem('username');
    document.getElementById("summaryUsername").innerHTML = username  ; 
  } else {
    document.getElementById("summaryUsername").innerHTML = 'Guest'
  }
}

/**
 * Loads the tasks from RemoteStorage/Backend.
 */
async function getTasksFromLocalStorage(){ /* ACHTUNG: NUR TESTDATEN*/
        try {
          const response = await getItem(taskremoteStorageKey);
          tasks =  JSON.parse(response);
        } catch (error) {
          console.log(error);
          tasks =  [];
        }
}

/**
 * Gets and returns the next due date for urgent taks.
 * @returns Date as String
 */
function getNextUrgentDate(){
  let urgent = tasks.filter(task => task.priority == "urgent"); 
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  if ( urgent.length > 0 ) {
    urgent = urgent.sort (function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    return new Date (urgent[0].dueDate).toLocaleDateString("de-DE", options); 
  }
  else {
    return "No urgent task"; 
  }
}

/**
 * Checks whether this is the first time the summary page has been called up after logging in and, if necessary, displays the welcome screen. 
 */
function checkMobileLogin(){
  mobileWelcomeShowed = localStorage.getItem('login'); 

  if ( window.matchMedia('screen and (max-width: 800px)').matches && mobileWelcomeShowed === "true") {
      localStorage.setItem('login', false); 
      document.getElementById("summaryWelcome").classList.remove("summaryWelcome");
      document.getElementById("summaryWelcome").classList.add("welcomeMobile");
      document.getElementById("summaryWelcome").classList.add("welcomeMobileOpacity");
      setTimeout(() => {
        document.getElementById("summaryWelcome").classList.remove("welcomeMobile");
        document.getElementById("summaryWelcome").classList.add("summaryWelcome");
        document.getElementById("summaryWelcome").classList.remove("welcomeMobileOpacity");
      }, "2000");
  } 
}
