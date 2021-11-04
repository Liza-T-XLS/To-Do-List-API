const app = {
  apiBaseUrl: 'http://localhost:8000',
  registerForm: document.querySelector('.registerForm'),
  loginForm: document.querySelector('.loginForm'),

  init: () => {
    console.log('init');
    app.registerForm.addEventListener('submit', app.registerFormHandler);
    app.loginForm.addEventListener('submit', app.loginFormHandler);
  },

  registerFormHandler: (e) => {
    e.preventDefault();
    const nameInputValue = document.getElementById('userName').value;
    const emailInputValue = document.getElementById('userEmail').value;
    if(nameInputValue.length > 0 && emailInputValue.length > 0) {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          name: nameInputValue,
          email: emailInputValue,
        }),
        credentials: 'include',
      };
      fetch(app.apiBaseUrl + '/user/registration', fetchOptions)
      .then(response => app.convertResponseToJson(response))
      .then(response => console.log(response))
      .catch(error => console.warn(error));
    }
  },

  loginFormHandler: (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('userId');
    const loginFormButtonElement = document.querySelector('.loginFormButton');
    if(loginFormButtonElement.innerText === 'edit') {
      inputElement.removeAttribute('disabled');
      loginFormButtonElement.innerText = 'submit';
      return;
    }
    const inputValue = inputElement.value;
    console.log(inputValue);
    const fetchUserOnSuccessHandler = (response) => {
      console.log(response);
      // disables userId input
      inputElement.setAttribute('disabled', '');
      // modifies loginFormButton submit to edit
      loginFormButtonElement.innerText = 'edit';
      // displays user info
      const userInfoElement = document.querySelector('.userInfo');
      userInfoElement.style.display = 'block';
      userInfoElement.innerText = 'Id: ' + response.user.id + ' | ' + response.user.name + ' | ' + response.user.email;
      const fetchTaskListOnSuccessHandler = (response) => {
        console.log(response);
        const userTasksElement = document.querySelector('.userTasks');
        userTasksElement.style.display = 'block';
        if(response.tasks.length > 0) {
          response.tasks.forEach(element => {
            const liElement = document.createElement('li');
            liElement.appendChild(document. createTextNode(element.id + ' | ' + element.title + ' | ' + element.description));
            userTasksElement.appendChild(liElement);
          });
        } else {
          console.log('There are currently no tasks.');
        }
      }
      app.fetchTaskList(response.user.id, fetchTaskListOnSuccessHandler);
    }
    if(inputValue > 0) {
      app.fetchUser(inputValue, fetchUserOnSuccessHandler);
    };
  },

  fetchUser: (userId, onSuccessHandler) => {
    const fetchOptions = {
      method: 'GET',
      credentials: 'include',
    };
    fetch(app.apiBaseUrl + '/user/' + userId, fetchOptions)
    .then(response => app.convertResponseToJson(response))
    .then(response => onSuccessHandler(response))
    .catch(error => console.warn(error));
  },

  fetchTaskList: (userId, onSuccessHandler) => {
    const fetchOptions = {
      method: 'GET',
      credentials: 'include',
    };
    fetch(app.apiBaseUrl + '/user/' + userId + '/tasks', fetchOptions)
    .then(response => app.convertResponseToJson(response))
    .then(response => onSuccessHandler(response))
    .catch(error => console.warn(error));
  },

  convertResponseToJson: (response) => {
    console.log(response);
    if (!response.ok) {
      throw 'Error';
    }
    return response.json();
  },
}


document.addEventListener('DOMContentLoaded', app.init);