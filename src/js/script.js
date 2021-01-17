const todoList = () => {
  let columns = [];

  if (localStorage.getItem('columns')) {
    columns = JSON.parse(localStorage.getItem('columns'));

    createColumnsBlock();
  }

  const addColumns = () => {
    const btn = document.querySelector('.wrapper__block-btn');
    const column_name = document.querySelector('.wrapper__block-column-name');

    btn.addEventListener('click', () => {
      const val_column = column_name.value;
      
      if (val_column.length > 2) {
        const column = {
          title: val_column,
          tasks: []
        }      

        columns.push(column);
        createColumnsBlock();
        saveInLocalStorage('columns', JSON.stringify(columns));
        addTasks();
        showFormAddTasks();
      }
    });
  
    addTasks();
  }
  
  addColumns();

  const removeColumns = () => {
    const btns = document.querySelectorAll('.wrapper__block-header-remove');

    btns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        Array.prototype.removeEl = function(idx) {
          delete this[idx];
          return this.filter(item => item);
        }

        columns = columns.removeEl(index);
        createColumnsBlock();
        saveInLocalStorage('columns', JSON.stringify(columns));
        addTasks();
        showFormAddTasks();
        removeColumns();
      });
    });
  }

  removeColumns();

  function addTasks() {
    const columns_block = document.querySelectorAll('.wrapper__block');
    const add_btns = document.querySelectorAll('.wrapper__block-form-task-btn[data-form-btn="add"]');
    const cancel_btns = document.querySelectorAll('.wrapper__block-form-task-btn[data-form-btn="cancel"]');
    const tasks_name = document.querySelectorAll('.wrapper__block-form-task-name');
    const form_add_tasks = document.querySelectorAll('.wrapper__block-form');
    const total_tasks = document.querySelectorAll('.wrapper__block-footer-total-tasks');

    columns_block.forEach((column, index) => {
      add_btns[index].addEventListener('click', function() {
        const val_task = tasks_name[index].value;
        const date = new Date();

        if (val_task.length > 2) {
          const task = {
            title: val_task,
            date: `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`,
            check: false
          }

          columns[index].tasks.push(task);
          createTasksBlock();
          total_tasks[index].innerText = setSizeTasks(index);
          saveInLocalStorage('columns', JSON.stringify(columns));

          form_add_tasks[index].classList.add('hide');
        }
      });

      cancel_btns[index].addEventListener('click', () => {
        form_add_tasks[index].classList.add('hide');
      });
    });
  }

  function createColumnsBlock() {
    const list = document.querySelector('.wrapper__blocks');

    list.innerHTML = '';

    columns.map((column, index) => {
      const block = `
      <div class="wrapper__block">
        <header class="wrapper__block-header">
          <h3 class="wrapper__block-header-title">${column.title}</h3>
          <button class="wrapper__block-header-remove"></button>
        </header>
        <main class="wrapper__block-main">
          <ul class="wrapper__block-main-tasks"></ul>
        </main>
        <footer class="wrapper__block-footer">
          <div class="wrapper__block-footer-total-tasks">
            ${setSizeTasks(index)}
          </div>
          <div class="wrapper__block-footer-add-new-task">
            <button class="wrapper__block-footer-add-new-task-btn">Добавить новую задачу</button>
          </div>
        </footer>
        <div class="wrapper__block-form hide">
          <input class="wrapper__block-form-task-name form-text" type="text" placeholder="Название задачи">
          <button class="wrapper__block-form-task-btn form-btn" data-form-btn="add">Добавить задачу</button>
          <button class="wrapper__block-form-task-btn form-btn form-btn-cancel" data-form-btn="cancel">Отмена</button>
        </div>
      </div>
      `;

      list.innerHTML += block;
    });

    createTasksBlock();
  }

  function createTasksBlock() {
    const lists = document.querySelectorAll('.wrapper__block-main-tasks');

    lists.forEach(list => list.innerHTML = '');

    columns.map((column, idx) => {
      column.tasks.map((task, index) => {
        const block = `
        <li class="wrapper__block-main-tasks-item">
          <label for="checkbox-${idx}-${index + 1}">
            <input type="checkbox" id="checkbox-${idx}-${index + 1}" />
            <span class="wrapper__block-main-tasks-item-check"></span>
            <div class="wrapper__block-main-tasks-item-name">${task.title}</div>
            <div class="wrapper__block-main-tasks-item-date">${task.date}</div>
          </label>
        </li>
        `;

        lists[idx].innerHTML += block;
      });
    });
  }

  function setSizeTasks(num) {
    let res = '';

    if (columns[num].tasks.length === 0 || columns[num].tasks.length > 4) {
      res = `${columns[num].tasks.length} задач`;
    } 

    if (columns[num].tasks.length === 1) {
      res = `${columns[num].tasks.length} задача`;
    }

    if (columns[num].tasks.length > 1 && columns[num].tasks.length < 5) {
      res = `${columns[num].tasks.length} задачи`;
    }

    return res;
  }

  function saveInLocalStorage(name, data) {
    localStorage.setItem(name, data);
  }

  function showFormAddTasks() {
    const form_add_tasks = document.querySelectorAll('.wrapper__block-form');
    const btns_open_form = document.querySelectorAll('.wrapper__block-footer-add-new-task-btn');

    btns_open_form.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        form_add_tasks[index].classList.remove('hide');
      });
    });
  }

  showFormAddTasks();
}

todoList();