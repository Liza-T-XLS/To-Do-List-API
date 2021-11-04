const app = {
  apiBaseUrl: 'http://localhost:8000',
  registerForm: document.querySelector('.registerForm'),
  loginForm: document.querySelector('.loginForm'),
  taskForm: document.querySelector('.taskForm'),

  init: () => {
    console.log('init');
    app.registerForm.addEventListener('submit', app.registerFormHandler);
    app.loginForm.addEventListener('submit', app.loginFormHandler);
    app.taskForm.addEventListener('submit', app.taskFormHandler);
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
    };
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
      // retrieves user's task list and displays it
      const fetchTaskListOnSuccessHandler = (response) => {
        console.log(response);
        const userTasksElement = document.querySelector('.userTasks');
        userTasksElement.style.display = 'block';
        if(response.tasks.length > 0) {
          response.tasks.forEach(element => {
            const liElement = document.createElement('li');
            liElement.appendChild(document.createTextNode(element.id + ' | ' + element.title + ' | ' + element.description));
            userTasksElement.appendChild(liElement);
          });
        } else {
          console.log('There are currently no tasks.');
        };
      // displays task form
      const taskFormElement = document.querySelector('.taskForm');
      taskFormElement.style.display = 'flex';
      };
      app.fetchTaskList(response.user.id, fetchTaskListOnSuccessHandler);
    };
    if(inputValue > 0) {
      app.fetchUser(inputValue, fetchUserOnSuccessHandler);
    };
  },

  taskFormHandler: (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const titleInputValue = document.getElementById('taskTitle').value;
    const descInputValue = document.getElementById('taskDesc').value;
    const addTaskOnSuccessHandler = (response) => {
      console.log(response);
      // clears form
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDesc').value = '';
      // adds new task to the user's list
      const userTasksElement = document.querySelector('.userTasks');
      const liElement = document.createElement('li');
      liElement.appendChild(document. createTextNode(response.data.id + ' | ' + response.data.title + ' | ' + response.data.description));
      userTasksElement.appendChild(liElement);
    };
    if(titleInputValue.length > 0) {
      app.addTask(userId, titleInputValue, descInputValue, addTaskOnSuccessHandler);
    };
  },

  // *************
  // * API Calls *
  // *************

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

  addTask: (userId, taskTitle, taskDesc, onSuccessHandler) => {
    const idValue = userId;
    const titleValue = taskTitle;
    const descValue = taskDesc;

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        userId: idValue,
        title: titleValue,
        description: descValue,
      }),
      credentials: 'include',
    };
    fetch(app.apiBaseUrl + '/task', fetchOptions)
    .then(response => app.convertResponseToJson(response))
    .then(response => onSuccessHandler(response))
    .catch(error => console.warn(error));
  },

  // *********
  // * Utils *
  // *********

  convertResponseToJson: (response) => {
    console.log(response);
    if (!response.ok) {
      throw 'Error';
    }
    return response.json();
  },
}

document.addEventListener('DOMContentLoaded', app.init);