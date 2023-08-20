/**
 * Function to integrate the templates.
 * @returns That returns the included HTML code
 */
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  }

  /**
   * Function for logging out of the JOIN system.
   */
  function logOut() {
    localStorage.removeItem('username');
  
    let logOut = document.getElementById('logOut');
  
    if (logOut.classList.contains('d-none')) {
      logOut.classList.remove('d-none');
    } else {
      logOut.classList.add('d-none');
    }
  }

/**
 * Opens the mobile menu
 */
function openMenu(){
  let mobileMenu = document.getElementById('mobileMenuPopup');
  if (mobileMenu.classList.contains('d-none')) {
    mobileMenu.classList.remove('d-none');
  } else {
    mobileMenu.classList.add('d-none');
  }
}

/**
 * Sets the active class to all links of the active page
 */
window.addEventListener("DOMContentLoaded", function() {
  var activePage = localStorage.getItem("activePage");
  if (activePage) {
      var link = document.querySelector('a[data-page="' + activePage + '"]');
      if (link) {
          link.classList.add("active");
      }
  }
});

/**
 * Changes the active Page
 * @param {Event} event - Event 
 * @param {String} pageName - page 
 */
function changeActivePage(event, pageName) {

  event.preventDefault(); // Prevents the reloading page. 
  var clickedElement = event.target;

  // Remove the "active" class from all links
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
  }

  // Add the "active" class to the clicked link
  clickedElement.classList.add("active");

  // Save the state of the active page to web storage
  localStorage.setItem("activePage", pageName);
}

function setMobileNavigationHighlighting(id){
  document.getElementById(id).classList.add("mobileTabActiv"); 
}