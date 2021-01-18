const todoList = () => {
  let columns = [];

  if (localStorage.getItem('columns')) {
    columns = JSON.parse(localStorage.getItem('columns'));

    createColumnsBlock();
  }

  Array.prototype.removeEl = function(index) {
    delete this[index];
    return this.filter(item => item);
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

        executeAllControlFunctions();
        saveInLocalStorage('columns', JSON.stringify(columns));
      }
    });
  
    addTasks();
  }
  
  addColumns();

  const removeColumns = () => {
    const btns = document.querySelectorAll('.wrapper__block-header-remove');

    btns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        columns = columns.removeEl(index);

        executeAllControlFunctions();
        saveInLocalStorage('columns', JSON.stringify(columns));
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
      add_btns[index].addEventListener('click', () => {
        const val_task = tasks_name[index].value;
        const date = new Date();

        if (val_task.length > 2) {
          const task = {
            title: val_task,
            date: `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`,
            check: false,
            id: Math.ceil(Date.now()) + index * 1.5,
            column_num: index
          }

          columns[index].tasks.push(task);
          total_tasks[index].innerText = setSizeTasks(index);
          form_add_tasks[index].classList.add('hide');

          createTasksBlock();
          saveInLocalStorage('columns', JSON.stringify(columns));
          doneTask();
          dragAndDrop();
          removeTasks();
        }
      });

      cancel_btns[index].addEventListener('click', () => form_add_tasks[index].classList.add('hide'));
    });
  }

  function doneTask() {
    const checkbox = document.querySelectorAll('.wrapper__block-main-tasks-item label input');
    const tasks = document.querySelectorAll('.wrapper__block-main-tasks-item');

    tasks.forEach((task, index) => {
      task.addEventListener('click', () => {
        columns.map((column, index_column) => {
          if (checkbox[index].checked) {
            const nums = checkbox[index].id.match(/\d+/g);

            column.tasks.map((task, index_task) => {
              if (index_column === +nums[0] && index_task === +nums[1]) {
                task.check = true;
              }
            });
            task.classList.add('done-task');
          } else {
            const nums = checkbox[index].id.match(/\d+/g);

            column.tasks.map((task, index_task) => {
              if (index_column === +nums[0] && index_task === +nums[1]) {
                task.check = false;
              }
            });
            task.classList.remove('done-task');
          }
        });

        saveInLocalStorage('columns', JSON.stringify(columns));
      });
    });
  } 

  doneTask();

  function removeTasks() {
    const tasks = document.querySelectorAll('.wrapper__block-main-tasks-item');
    const btns = document.querySelectorAll('.wrapper__block-main-tasks-item-date-remove-task-btn');
    const dates = document.querySelectorAll('.wrapper__block-main-tasks-item-date-text');

    const showBtnRemove = () => {
      tasks.forEach((task, index_task) => {
        task.addEventListener('mouseenter', () => {
          btns[index_task].classList.remove('hide');
          dates[index_task].classList.add('hide');
        });
  
        task.addEventListener('mouseleave', () => {
          btns[index_task].classList.add('hide');
          dates[index_task].classList.remove('hide');
        });
      });
    }

    showBtnRemove();

    columns.map((column, index_column) => {
      const buttons = document.querySelectorAll(`.wrapper__block-main-tasks-item-date-remove-task-btn[data-column="${index_column}"]`);

      buttons.forEach((btn, index_btn) => {
        btn.addEventListener('click', () => {
          const column_num = +btn.dataset.column;

          columns[column_num].tasks = columns[column_num].tasks.removeEl(index_btn);

          saveInLocalStorage('columns', JSON.stringify(columns));
          executeAllControlFunctions();
        });
      });
    });
  }

  removeTasks();

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
          <ul class="wrapper__block-main-tasks" data-list-num="${index}"></ul>
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
    dragAndDrop();
    removeTasks();
  }

  function createTasksBlock() {
    const lists = document.querySelectorAll('.wrapper__block-main-tasks');

    lists.forEach(list => list.innerHTML = '');

    columns.map((column, idx) => {
      column.tasks.map((task, index) => {
        const block = `
        <li class="wrapper__block-main-tasks-item ${task.check ? 'done-task' : ''}" data-column="${idx}" data-num-task="${index}">
          <label for="checkbox-${idx}-${index}">
            <input type="checkbox" id="checkbox-${idx}-${index}" ${task.check ? 'checked' : ''} />
            <span class="wrapper__block-main-tasks-item-check"></span>
            <div class="wrapper__block-main-tasks-item-name">${task.title}</div>
            <div class="wrapper__block-main-tasks-item-date">
              <button class="wrapper__block-main-tasks-item-date-remove-task-btn hide" data-column="${idx}"></button>
              <span class="wrapper__block-main-tasks-item-date-text">${task.date}</span>
            </div>
          </label>
        </li>
        `;

        lists[idx].innerHTML += block;
      });
    });
  }

  function dragAndDrop() {
    const tasks = document.querySelectorAll('.wrapper__block-main-tasks-item');
    const list_task = document.querySelectorAll('.wrapper__block-main-tasks');

    tasks.forEach(task => {
      task.draggable = true;
      
      task.addEventListener('dragstart', () => setTimeout(() => task.classList.add('selected-task'), 0));
      task.addEventListener('dragend', () => task.classList.remove('selected-task'));
    });

    list_task.forEach(list => {
      list.addEventListener('dragover', e => {
        e.preventDefault();
      }, false);

      list.addEventListener('drop', () => {
        const el = document.querySelector('.selected-task');

        setInfoOfTasks(+list.dataset.listNum, el);
      
        list.append(el);

        createColumnsBlock();
        doneTask();
        executeAllControlFunctions();
      });
    });
  }

  dragAndDrop();

  function setInfoOfTasks(drop_zone_num, element) {
    if (element) {
      const el = columns[+element.dataset.column].tasks[+element.dataset.numTask];
    
      columns.map((column, index_column) => {
        if (!column.tasks.find(task => task.id === el.id)) {
          return;
        }
        
        const selected_task = column.tasks.find(task => task.id === el.id);
  
        if (index_column === selected_task.column_num) {
          column.tasks.map((task, index_task) => {
            if (task.id === selected_task.id) {
              const label = [...element.childNodes].find(item => item.nodeName === 'LABEL');
              const checkbox = [...label.childNodes].find(item => item.nodeName === 'INPUT');
              const btn = document.querySelector(`.wrapper__block-main-tasks-item-date-remove-task-btn[data-column="${selected_task.column_num}"]`);
  
              label.setAttribute('for', `checkbox-${drop_zone_num}-${index_task}`);
              checkbox.setAttribute('id', `checkbox-${drop_zone_num}-${index_task}`);
              btn.dataset.column = drop_zone_num;
  
              selected_task.column_num = drop_zone_num;

              element.dataset.column = drop_zone_num;
              element.dataset.numTask = index_task;
  
              column.tasks = column.tasks.removeEl(index_task);
              columns[drop_zone_num].tasks.push(selected_task);
            }
          });
        }
      });
  
      saveInLocalStorage('columns', JSON.stringify(columns));
    }
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

    btns_open_form.forEach((btn, index) => btn.addEventListener('click', () => form_add_tasks[index].classList.remove('hide')));
  }

  showFormAddTasks();

  function executeAllControlFunctions() {
    createColumnsBlock();
    addTasks();
    showFormAddTasks();
    removeColumns();
    removeTasks();
    dragAndDrop();
    doneTask();
  }
}

todoList();