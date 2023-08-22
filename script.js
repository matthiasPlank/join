/**
 * Array for storing user data.
 */
let user = [];

async function init() {
    loadUser();
    loadRememberMe();
}

/**
 * Loads the user data from the backend.
 */
async function loadUser() {
    try {
        user = JSON.parse(await getItem('user'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Check whether an email is valid. 
 * Returns true when the email is valid, otherwise false.
 */
function isValidEmail(email) {
    return email.includes('@');
  }


/**
 * Eventlistener who is called when the DOM is loaded.
 * Elements for registration screen, registration screen, password forgotten screen, password change screen.
 */
  let loginscreen, signupscreen, forgotPW1, changePW;

  window.addEventListener('DOMContentLoaded', function() {
    loginscreen = document.getElementById('login-screen');
    signupscreen = document.getElementById('sign-up-screen');
    forgotPW1 = document.getElementById('forgotPW');
    changePW = document.getElementById('changePW');
    signupButton = document.getElementById('signup-screen');
  });


/**
 * Opens a certain page based on the specified parameter.
 */
function openPage(page) {
    if (page === "log-in") {
        checkLogin()
    } else  if (page === "summary") {
        localStorage.setItem('login', true);
        window.location.href = "./summary/summary.html";
    } else if (page === "sign-up") {
        loadSignUp();
    } else if (page === "back") {
        back();
    } else if (page === "forgotPW") {
        forgotPW();
    }else if (page === "backChange") {
        backChange();
    }
}

/**
 * Carries out a gas application.
 */
function guestLogin(){
       document.getElementById("summaryUsername").innerHTML = 'Guest'  ; 
}

/**
 * Loads the registration form.
 */
function loadSignUp() {
    loginscreen.style.display = 'none';
    signupButton.style.display = 'none';
    signupscreen.style.display = 'flex';
}


/**
 * Displays the screen to reset the password.
 */
function forgotPW() {
    loginscreen.style.display = 'none';
    signupButton.style.display = 'none';
    forgotPW1.style.display = 'flex';
}

/**
* Go back to the registration screen.
*/
function back() {
    loginscreen.style.display = 'flex';
    signupButton.style.display = 'flex';
    signupscreen.style.display = 'none';
    forgotPW1.style.display = 'none';
}

/**
* Switch to the previous view (change password).
*/
function  backChange(){
    forgotPW1.style.display = 'flex';
    changePW.style.display = 'none';
}

/**
* Set the password back.
*/
  function resetPW() {
    let emailInput = document.getElementById('email-forgot');
    let emailValue = emailInput.value;
  
    if (emailValue !== '' && isValidEmail(emailValue)) {
      document.getElementById('email-forgot').value=''
      emailCheck()
  
      animationInfo.addEventListener('animationend', function() {
        animationInfo.style.display = 'none';
      }, { once: true });
    }
  }

/**
* Check the email and indicate animations.
*/
function emailCheck() {
  let animationInfo = document.getElementById('animation-info');
  animationInfo.style.display = 'flex';
  forgotPW1.style.display = 'none';
  loginscreen.style.display = 'none';
  signupButton.style.display = 'none';
  changePW.style.display = 'flex';

  // Add the eventlistener for 'Animation'
  animationInfo.addEventListener('animationend', function() {
    // Animation is complete
    animationInfo.style.display = 'none';
  }, { once: true }); // { once: true } ensures that the eventlisterner is only executed once
}

/**
* Checks the entered password.
*/
  function checkPW() {
    let newPasswordInput = document.getElementById('new-password');
    let confirmPasswordInput = document.getElementById('confirm-password');
  
    let newPassword = newPasswordInput.value;
    let confirmPassword = confirmPasswordInput.value;
  
    if (newPassword !== '' && confirmPassword !== '' && newPassword === confirmPassword) {
      let animationReset = document.getElementById('animation-reset');

      confirmPasswordInput.value = ''
      newPasswordInput.value = ''

      animationReset.style.display = 'flex';
      changePW.style.display = 'none';
      loginscreen.style.display = 'flex';
      signupButton.style.display = 'flex';
  
      animationReset.addEventListener('animationend', function() {
        animationReset.style.display = 'none';
      }, { once: true });
    }
  }
 
  
/**
* Checks the login
*/
  function checkLogin() {
    let email = document.getElementById('log-in-email').value;
    let password = document.getElementById('log-in-pw').value;
    let foundUser = user.find(function (user) {
      return user.email === email && user.password === password;
    });
    if (foundUser) {
        document.getElementById("wrongCredentials").classList.add("dsp-none"); 
        userCheck(foundUser, email, password);
    }
    else{
      document.getElementById("wrongCredentials").classList.remove("dsp-none"); 
    }
  }


/**
* Verifies the user.
*/
  function userCheck(foundUser, emailInput, passwordInput){
    document.getElementById('current-user').textContent = '';
    document.getElementById('current-user').textContent = 'Angemeldet ist der Benutzer: ' + foundUser.name;
    localStorage.setItem('username', foundUser.name);
    localStorage.setItem('login', true);
    emailInput.value = '';
    passwordInput.value = '';
    window.location.href = "./summary/summary.html";
  }
  
/**
 * Eventlistener when the DOM is loaded, to get HTML objects. 
 */
document.addEventListener('DOMContentLoaded', function () {
  let nameInput = document.getElementById('name');
  let email = document.getElementById('email');
  let password = document.getElementById('password');
  let registerBtn = document.getElementById('registerBtn');

/**
 * Register a new user.
 */
  async function register() {
    if ( ( nameInput.value === '' || email.value === '' || password.value === '') || !isValidEmail(email.value) || isUserAlreadyRegistered(nameInput.value, email.value)){
      return;
    }
    registerBtn.disabled = true;
    user.push({
      name: nameInput.value,
      email: email.value,
      password: password.value,
    });
    await setItem('user', JSON.stringify(user));
    resetForm();
    loadUser();
    back();
  }

/**
* Reset the form.
*/
  function resetForm() {
    nameInput.value = '';
    email.value = '';
    password.value = '';
    registerBtn.disabled = false;
  }

/**
 * Checks if a user is already registered.
 */
  function isUserAlreadyRegistered(name, email) {
    for (let i = 0; i < user.length; i++) {
      if (user[i].name === name || user[i].email === email) {
        return true;
      }
    }
    return false;
  }
  registerBtn.addEventListener('click', register);
});

/**
 *  Show and hide the password.
 * @param {Object} pages - HTML element ID
 */
function showPW(pages){

  let passwordInput = document.getElementById(pages);
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else if (passwordInput.type === 'text') {
    passwordInput.type = 'password';
  }
}

/**
 * Saving the values in the local storage. 
 */
function login() {

  let email = document.getElementById('log-in-email').value;
  let password = document.getElementById('log-in-pw').value;
  let rememberMe = document.getElementById('remember-me-checkbox').checked;

  // Check whether email and password have been entered
  if (email && password && rememberMe) {
    // Removing the previous entries from the local storage
    removeItemsFromLocalStorage(); 
    // Saving the new values in the local storage
    setItemsToLocalStorage(email, password , rememberMe); 
  } else if(!rememberMe) {
    // Removing the previous entries from the local storage
    removeItemsFromLocalStorage(); 
  }
}

/**
 * Removes the email, password and remberMe item from the local storage. 
 */
function removeItemsFromLocalStorage(){
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('rememberMe');
}

/**
 * Sets the email, password and remberMe item to the local storage. 
 */
function setItemsToLocalStorage(email, password , rememberMe){
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);
  localStorage.setItem('rememberMe', rememberMe);
}

/**
 * Calling up the values ​​from the local storage
 */
function loadRememberMe(){
  let emailInput = document.getElementById('log-in-email');
  let passwordInput = document.getElementById('log-in-pw');
  let rememberMeCheckbox = document.getElementById('remember-me-checkbox');

  // Check whether saved values ​​are available in local storage
  if (localStorage.getItem('email') && localStorage.getItem('password') && localStorage.getItem('rememberMe')) {
    // Get values ​​from local storage and set it in the HTML template. 
    emailInput.value = localStorage.getItem('email');
    passwordInput.value = localStorage.getItem('password');
    rememberMeCheckbox.checked = (localStorage.getItem('rememberMe') === 'true');
  }
}


