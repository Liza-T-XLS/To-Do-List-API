const app = {
  apiBaseUrl: 'http://localhost:8000',
  registrationForm: document.querySelector('.registrationForm'),
  loginForm: document.querySelector('.loginForm'),
  taskForm: document.querySelector('.taskForm'),
  accountDeletionForm: document.querySelector('.accountDeletionForm'),

  init: () => {
    console.log('init');
    app.registrationForm.addEventListener('submit', app.registrationFormHandler);
    app.loginForm.addEventListener('submit', app.loginFormHandler);
    app.taskForm.addEventListener('submit', app.taskFormHandler);
    app.accountDeletionForm.addEventListener('submit', app.accountDeletionFormHandler);
  },

  registrationFormHandler: (e) => {
    e.preventDefault();
    const nameInputElement = document.getElementById('userName');
    const emailInputElement = document.getElementById('userEmail');
    const registrationFormErrorMsgElement = document.querySelector('.registrationFormErrorMsg');
    const nameInputValue = nameInputElement.value;
    const emailInputValue = emailInputElement.value;
    const createUserOnSuccessHandler = (response) => {
      console.log(response);
      // if error, displays error msg
      if(response.responseCode > 300) {
        registrationFormErrorMsgElement.innerText = response.message;
        return;
      }
      // clears form
      nameInputElement.value = '';
      emailInputElement.value = '';
      registrationFormErrorMsgElement.style.color = 'green';
      registrationFormErrorMsgElement.innerText = `Your account has been created. You can now log in with your ID: ${response.data.id}`
    };

    if(nameInputValue.length > 0 && emailInputValue.length > 0) {
      app.createUser(nameInputValue, emailInputValue, createUserOnSuccessHandler);
    }
  },

  loginFormHandler: (e) => {
    e.preventDefault();
    const idInputElement = document.getElementById('userId');
    const loginFormButtonElement = document.querySelector('.loginFormButton');
    const userInfoElement = document.querySelector('.userInfo');
    // if Edit button is hit, resets to original display
    if(loginFormButtonElement.innerText === 'Edit') {
      idInputElement.removeAttribute('disabled');
      loginFormButtonElement.innerText = 'submit';
      // displays registrationForm
      app.registrationForm.style.display = 'flex';
      // removes user info
      userInfoElement.style.display = 'none';
      // removes task list
      document.querySelector('.taskListTitle').style.display = 'none';
      document.querySelector('.userTasks').replaceChildren();
      document.querySelector('.userTasks').style.display = 'none';
      // removes taskForm
      document.querySelector('.taskForm').style.display = 'none';
      // removes accountDeletionForm
      app.accountDeletionForm.style.display = 'none';
      return;
    };
    const idInputValue = idInputElement.value;
    const fetchUserOnSuccessHandler = (response) => {
      console.log(response);
      const loginFormErrorMsgElement = document.querySelector('.loginFormErrorMsg');
      // if error, displays error msg
      if(response.responseCode > 300) {
        loginFormErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      loginFormErrorMsgElement.innerText = '';
      // disables userId input
      idInputElement.setAttribute('disabled', '');
      // modifies loginFormButton submit to edit
      loginFormButtonElement.innerText = 'Edit';
      // removes registrationForm
      app.registrationForm.style.display = 'none';
      // displays user info
      userInfoElement.style.display = 'block';
      userInfoElement.innerText = 'Id: ' + response.user.id + ' | ' + response.user.name + ' | ' + response.user.email;

      const fetchTaskListOnSuccessHandler = (response) => {
        console.log(response);
        // if error, displays error msg
        const taskListErrorMsgElement = document.querySelector('.taskListErrorMsg');
        if(response.responseCode > 300) {
          taskListErrorMsgElement.innerText = response.message;
          return;
        }
        // if no error, removes error msg if any
        taskListErrorMsgElement.innerText = '';
        // displays task form
        const taskFormElement = document.querySelector('.taskForm');
        taskFormElement.style.display = 'flex';
        document.querySelector('.taskFormErrorMsg').innerText = '';
        // displays task list
        const taskListTitleElement = document.querySelector('.taskListTitle');
        taskListTitleElement.style.display = 'block';
        const userTasksElement = document.querySelector('.userTasks');
        userTasksElement.style.display = 'block';
        // if any task exists, builds the task list
        if(response.tasks.length > 0) {
          response.tasks.forEach(element => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
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
            userTasksElement.appendChild(taskElement);
            taskElement.querySelector('.deleteIcon').addEventListener('click', app.taskDeleteIconHandler);
          });
        } else {
          console.log('There are currently no tasks.');
        };
      };
      app.fetchTaskList(response.user.id, fetchTaskListOnSuccessHandler);

      // displays accountDeletionForm
      app.accountDeletionForm.style.display = 'flex';

    };
    if(idInputValue > 0) {
      app.fetchUser(idInputValue, fetchUserOnSuccessHandler);
    };
  },

  taskFormHandler: (e) => {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const titleInputValue = document.getElementById('taskTitle').value;
    const descInputValue = document.getElementById('taskDesc').value;
    const taskFormErrorMsgElement = document.querySelector('.taskFormErrorMsg');

    const addTaskOnSuccessHandler = (response) => {
      console.log(response);
      // if error, displays error msg
      if(response.responseCode > 300) {
        taskFormErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      taskFormErrorMsgElement.innerText = '';
      // clears form
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDesc').value = '';
      // adds new task to the user's list
      const userTasksElement = document.querySelector('.userTasks');
      const taskElement = document.createElement('div');
      taskElement.classList.add('task');
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
      userTasksElement.appendChild(taskElement);
      taskElement.querySelector('.deleteIcon').addEventListener('click', app.taskDeleteIconHandler);
    };
    if(titleInputValue.length > 0) {
      app.addTask(userId, titleInputValue, descInputValue, addTaskOnSuccessHandler);
    };
  },

  taskDeleteIconHandler: (e) => {
    const task = e.target.closest('.task');
    const taskId = task.querySelector('.taskId').innerText;
    const deleteTaskOnSuccessHandler = (response) => {
      const taskListErrorMsgElement = document.querySelector('.taskListErrorMsg');
      if(response.responseCode > 300) {
        taskListErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      taskListErrorMsgElement.innerText = '';
      // removes deleted task from Task List
      const userTasksElement = document.querySelector('.userTasks');
      userTasksElement.removeChild(task);
    };
    app.deleteTask(taskId, deleteTaskOnSuccessHandler);
  },

  accountDeletionFormHandler: (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const deleteUserOnSuccessHandler = (response) => {
      console.log(response);
      console.log('account deleted');
      const accountDeletionFromErrorMsgElement = document.querySelector('.accountDeletionFormErrorMsg');
      if(response.responseCode > 300) {
        accountDeletionFromErrorMsgElement.innerText = response.message;
        return;
      }
      // if no error, removes error msg if any
      accountDeletionFromErrorMsgElement.innerText = '';
      const accountDeletionFormInstructionsElement = document.querySelector('.accountDeletionFormInstructions');
      accountDeletionFormInstructionsElement.innerText = 'Your account has been successfully deleted. Refresh the page.';
      accountDeletionFormInstructionsElement.style.color = 'green';
    };
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
      mode: 'cors',
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
      mode: 'cors',
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

  deleteTask: (taskId, onSuccessHandler) => {
    const fetchOptions = {
      method: 'DELETE',
      mode: 'cors',
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
    console.log(response);
    // if (!response.ok) {
    //   throw 'Error';
    // }
    return response.json();
  },
}

document.addEventListener('DOMContentLoaded', app.init);