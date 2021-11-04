const app = {
  apiBaseUrl: 'http://localhost:8000',

  // ****************
  // * DOM Elements *
  // ****************

  // Registration Form
  registrationForm: document.querySelector('.registrationForm'),
  nameInputElement: document.getElementById('userName'),
  emailInputElement: document.getElementById('userEmail'),
  registrationFormErrorMsgElement: document.querySelector('.registrationFormErrorMsg'),
  // Login Form
  loginForm: document.querySelector('.loginForm'),
  idInputElement: document.getElementById('userId'),
  loginFormButtonElement: document.querySelector('.loginFormButton'),
  loginFormErrorMsgElement: document.querySelector('.loginFormErrorMsg'),
  // User Info
  userInfoElement: document.querySelector('.userInfo'),
  // Task Form
  taskForm: document.querySelector('.taskForm'),
  titleInputElement: document.getElementById('taskTitle'),
  descInputElement: document.getElementById('taskDesc'),
  taskFormErrorMsgElement: document.querySelector('.taskFormErrorMsg'),
  // User Tasks
  taskListTitleElement: document.querySelector('.taskListTitle'),
  taskListErrorMsgElement: document.querySelector('.taskListErrorMsg'),
  userTasksElement: document.querySelector('.userTasks'), 
  // Account Deletion Form
  accountDeletionForm: document.querySelector('.accountDeletionForm'),
  accountDeletionFormInstructionsElement: document.querySelector('.accountDeletionFormInstructions'),
  accountDeletionFormErrorMsgElement: document.querySelector('.accountDeletionFormErrorMsg'),

  init: () => {
    console.log('init');
    app.registrationForm.addEventListener('submit', app.registrationFormHandler);
    app.loginForm.addEventListener('submit', app.loginFormHandler);
    app.taskForm.addEventListener('submit', app.taskFormHandler);
    app.accountDeletionForm.addEventListener('submit', app.accountDeletionFormHandler);
  },

  // ************
  // * Handlers *
  // ************

  registrationFormHandler: (e) => {
    e.preventDefault();

    const nameInputValue = app.nameInputElement.value;
    const emailInputValue = app.emailInputElement.value;

    // Response handler
    const createUserOnSuccessHandler = (response) => {
      // if error, displays error msg
      if(response.responseCode > 300) {
        app.registrationFormErrorMsgElement.innerText = response.message;
        return;
      }
      // clears form
      app.nameInputElement.value = '';
      app.emailInputElement.value = '';
      // confirmation msg
      app.registrationFormErrorMsgElement.style.color = 'green';
      app.registrationFormErrorMsgElement.innerText = `Your account has been created. You can now log in with your ID: ${response.data.id}`
    };

    // API call
    if(nameInputValue.length > 0 && emailInputValue.length > 0) {
      app.createUser(nameInputValue, emailInputValue, createUserOnSuccessHandler);
    }
  },

  loginFormHandler: (e) => {
    e.preventDefault();

    app.registrationFormErrorMsgElement.innerText = '';
    // if Edit button is hit, resets to original display
    if(app.loginFormButtonElement.innerText === 'Edit') {
      app.idInputElement.removeAttribute('disabled');
      app.loginFormButtonElement.innerText = 'submit';
      // displays registrationForm
      app.registrationForm.style.display = 'flex';
      // removes user info
      app.userInfoElement.style.display = 'none';
      // removes task list
      app.taskListTitleElement.style.display = 'none';
      app.userTasksElement.replaceChildren();
      app.userTasksElement.style.display = 'none';
      // removes taskForm
      app.taskForm.style.display = 'none';
      // removes accountDeletionForm
      app.accountDeletionForm.style.display = 'none';
      app.accountDeletionFormErrorMsgElement.innerText = '';
      return;
    };

    // Response handler
    const fetchUserOnSuccessHandler = (response) => {
      // if error, displays error msg
      if(response.responseCode > 300) {
        app.loginFormErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      app.loginFormErrorMsgElement.innerText = '';
      // disables userId input
      app.idInputElement.setAttribute('disabled', '');
      // modifies loginFormButton submit to edit
      app.loginFormButtonElement.innerText = 'Edit';
      // removes registrationForm
      app.registrationForm.style.display = 'none';
      // displays user info
      app.userInfoElement.style.display = 'block';
      app.userInfoElement.innerText = 'Id: ' + response.user.id + ' | ' + response.user.name + ' | ' + response.user.email;
      // displays accountDeletionForm
      app.accountDeletionForm.style.display = 'flex';
      app.accountDeletionFormErrorMsgElement.innerText = '';
      app.accountDeletionFormInstructionsElement.innerText = 'If you no longer wish to use our services, you can delete your account by clicking on the button below:';
      app.accountDeletionFormInstructionsElement.style.color = 'black';

      // Response handler
      const fetchTaskListOnSuccessHandler = (response) => {
        // if error, displays error msg
        if(response.responseCode > 300) {
          app.taskListErrorMsgElement.innerText = response.message;
          return;
        }
        // if no error, removes error msg if any
        app.taskListErrorMsgElement.innerText = '';
        // displays task form
        app.taskForm.style.display = 'flex';
        app.taskFormErrorMsgElement.innerText = '';
        // displays task list
        app.taskListTitleElement.style.display = 'block';
        app.userTasksElement.style.display = 'block';
        // if any task exists, builds the task list
        if(response.tasks.length > 0) {
          response.tasks.forEach(element => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.setAttribute('id', element.id);
            taskElement.innerHTML = `
            <div class="taskId">${element.id}</div>
            <div class="taskData">
              <span class="title">${element.title}</span><br/>
              <span class="description">${element.description}</span><br/>
            </div>
            <div class="deleteTask">
              <span class="deleteIcon">X</span>
            </div>
            `;
            app.userTasksElement.appendChild(taskElement);
            taskElement.querySelector('.deleteIcon').addEventListener('click', app.taskDeleteIconHandler);
          });
        } else {
          console.log('There are currently no tasks.');
        };
      };

      // API call
      app.fetchTaskList(response.user.id, fetchTaskListOnSuccessHandler);

      // displays accountDeletionForm
      app.accountDeletionForm.style.display = 'flex';

    };

    // API call
    const idInputValue = app.idInputElement.value;

    if(idInputValue > 0) {
      app.fetchUser(idInputValue, fetchUserOnSuccessHandler);
    };
  },

  taskFormHandler: (e) => {
    e.preventDefault();

    // Response handler
    const addTaskOnSuccessHandler = (response) => {
      // if error, displays error msg
      if(response.responseCode > 300) {
        app.taskFormErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      app.taskFormErrorMsgElement.innerText = '';
      // clears form
      app.titleInputElement.value = '';
      app.descInputElement.value = '';
      // adds new task to the user's list
      const taskElement = document.createElement('div');
      taskElement.classList.add('task');
      taskElement.setAttribute('id', response.data.id);
      taskElement.innerHTML = `
        <div class="taskId">${response.data.id}</div>
        <div class="taskData">
          <span class="title">${response.data.title}</span><br/>
          <span class="description">${response.data.description}</span><br/>
        </div>
        <div class="deleteTask">
          <span class="deleteIcon">X</span>
        </div>
      `;
      app.userTasksElement.appendChild(taskElement);
      taskElement.querySelector('.deleteIcon').addEventListener('click', app.taskDeleteIconHandler);
    };

    // API call
    const userId = app.idInputElement.value;
    const titleInputValue = app.titleInputElement.value;
    const descInputValue = app.descInputElement.value;

    if(titleInputValue.length > 0) {
      app.addTask(userId, titleInputValue, descInputValue, addTaskOnSuccessHandler);
    };
  },

  taskDeleteIconHandler: (e) => {
    const task = e.target.closest('.task');
    const taskId = task.id;
    
    // Response handler
    const deleteTaskOnSuccessHandler = (response) => {
      if(response.responseCode > 300) {
        app.taskListErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      app.taskListErrorMsgElement.innerText = '';
      // removes deleted task from Task List
      app.userTasksElement.removeChild(task);
    };

    // API call
    app.deleteTask(taskId, deleteTaskOnSuccessHandler);
  },

  accountDeletionFormHandler: (e) => {
    e.preventDefault();

    // Response handler
    const deleteUserOnSuccessHandler = (response) => {
      if(response.responseCode > 300) {
        app.accountDeletionFormErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      app.accountDeletionFormErrorMsgElement.innerText = '';
      // confirmation msg
      app.accountDeletionFormInstructionsElement.innerText = 'Your account has been successfully deleted. Refresh the page.';
      app.accountDeletionFormInstructionsElement.style.color = 'green';
    };

    // API call
    const userId = app.idInputElement.value;

    app.deleteUser(userId, deleteUserOnSuccessHandler);
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

  createUser: (userName, userEmail, onSuccessHandler) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
      }),
      credentials: 'include',
    };
    fetch(app.apiBaseUrl + '/user', fetchOptions)
    .then(response => app.convertResponseToJson(response))
    .then(response => onSuccessHandler(response))
    .catch(error => console.warn(error));
  },

  deleteUser: (userId, onSuccessHandler) => {
    const fetchOptions = {
      method: 'DELETE',
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
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        title: taskTitle,
        description: taskDesc,
      }),
      credentials: 'include',
    };
    fetch(app.apiBaseUrl + '/task', fetchOptions)
    .then(response => app.convertResponseToJson(response))
    .then(response => onSuccessHandler(response))
    .catch(error => console.warn(error));
  },

  deleteTask: (taskId, onSuccessHandler) => {
    const fetchOptions = {
      method: 'DELETE',
      credentials: 'include',
    };
    fetch(app.apiBaseUrl + '/task/' + taskId, fetchOptions)
    .then(response => app.convertResponseToJson(response))
    .then(response => onSuccessHandler(response))
    .catch(error => console.warn(error));
  },

  // *********
  // * Utils *
  // *********

  convertResponseToJson: (response) => {
    return response.json();
  },
}

document.addEventListener('DOMContentLoaded', app.init);