import colors_theme from './colorsTheme';

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
          tasks: [],
          color_theme: colors_theme.light
        }      

        columns.push(column);

        saveInLocalStorage('columns', JSON.stringify(columns));
        executeAllControlFunctions();
      }
    });
  
    addTasks();
  }
  
  addColumns();

  const removeColumns = () => {
    const btns = document.querySelectorAll('.wrapper__block-header-remove');

    btns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        document.documentElement.classList.remove('dark-background');

        columns = columns.removeEl(index);

        saveInLocalStorage('columns', JSON.stringify(columns));
        executeAllControlFunctions();
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

          saveInLocalStorage('columns', JSON.stringify(columns));
          executeAllControlFunctions();
        }
      });

      cancel_btns[index].addEventListener('click', () => form_add_tasks[index].classList.add('hide'));
    });
  }

  function doneTask() {
    columns.map((column, index_column) => {
      const checkbox = document.querySelectorAll(`.wrapper__block-main-tasks-item-checkbox[data-column="${index_column}"]`);
      const tasks = document.querySelectorAll(`.wrapper__block-main-tasks-item[data-column="${index_column}"]`);
      const names_tasks = document.querySelectorAll(`.wrapper__block-main-tasks-item-name[data-column="${index_column}"]`);

      tasks.forEach((task, index_task) => {
        task.addEventListener('click', () => {
          if (checkbox[index_task].checked) {
            const nums = checkbox[index_task].id.match(/\d+/g);

            column.tasks.map((task, index_task) => {
              if (index_column === +nums[0] && index_task === +nums[1]) {
                task.check = true;

                names_tasks[index_task].classList.add('done-task');
              }
            });
          } else {
            const nums = checkbox[index_task].id.match(/\d+/g);

            column.tasks.map((task, index_task) => {
              if (index_column === +nums[0] && index_task === +nums[1]) {
                task.check = false;

                names_tasks[index_task].classList.remove('done-task');
              }
            });
          }

          saveInLocalStorage('columns', JSON.stringify(columns));
        });
      });
    });
  } 

  doneTask();

  function changeTextColumns() {
    const settings_blocks = document.querySelectorAll('.wrapper__block-header-settings-column');
    const columns_blocks = document.querySelectorAll('.wrapper__block');
    const headings_columns = document.querySelectorAll('.wrapper__block-header-title');
    const inputs = document.querySelectorAll('.wrapper__block-header-title-change-column');
    const btns = document.querySelectorAll('.wrapper__block-header-change-column-text-btn');

    const showElements = () => {
      columns_blocks.forEach((column, index_column) => {
        column.addEventListener('mouseenter', () => settings_blocks[index_column].classList.remove('hide'));
        column.addEventListener('mouseleave', () => settings_blocks[index_column].classList.add('hide'));
      });
    }

    showElements();

    btns.forEach((btn, index_btn) => {
      let open = false;

      btn.addEventListener('click', () => {
        open = !open;

        headings_columns[index_btn].classList.toggle('hide');
        inputs[index_btn].classList.toggle('hide');

        [...btn.childNodes].find(item => item.nodeName === 'IMG').src = open ? './images/check.svg' : './images/pencil.svg';
        [...btn.childNodes].find(item => item.nodeName === 'IMG').alt = open ? 'check' : 'pencil';

        btn.classList.toggle('blue-btn');

        if (!open) {
          if (inputs[index_btn].value) {
            columns[index_btn].title = inputs[index_btn].value;

            saveInLocalStorage('columns', JSON.stringify(columns));
            executeAllControlFunctions();
          } else {
            headings_columns[index_btn].classList.remove('hide');
            inputs[index_btn].classList.add('hide');
          }
        }

        inputs[index_btn].focus();
      });
    });
  }

  changeTextColumns();

  function removeTasks() {
    const tasks = document.querySelectorAll('.wrapper__block-main-tasks-item');
    const btns_remove_task = document.querySelectorAll('.wrapper__block-main-tasks-item-date-remove-task-btn');
    const btns_change_task = document.querySelectorAll('.wrapper__block-main-tasks-item-date-change-task-btn');
    const dates = document.querySelectorAll('.wrapper__block-main-tasks-item-date-text');

    const showBtns = () => {
      tasks.forEach((task, index_task) => {
        task.addEventListener('mouseenter', () => {
          btns_remove_task[index_task].classList.remove('hide');
          btns_change_task[index_task].classList.remove('hide');
          dates[index_task].classList.add('hide');
        });
  
        task.addEventListener('mouseleave', () => {
          btns_remove_task[index_task].classList.add('hide');
          btns_change_task[index_task].classList.add('hide');
          dates[index_task].classList.remove('hide');
        });
      });
    }

    showBtns();

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

  function changeTextTasks() {
    columns.map((column, index_column) => {
      const btns = document.querySelectorAll(`.wrapper__block-main-tasks-item-date-change-task-btn[data-column="${index_column}"]`);
      const inputs = document.querySelectorAll(`.wrapper__block-main-tasks-item-change-task-name[data-column="${index_column}"]`);
      const names_tasks = document.querySelectorAll(`.wrapper__block-main-tasks-item-name[data-column="${index_column}"]`);
  
      let open = false;
  
      btns.forEach((btn, index_btn) => {
        btn.addEventListener('click', () => {
          const num_column = +btn.dataset.column;
  
          open = !open;
  
          [...btn.childNodes].find(item => item.nodeName === 'IMG').src = open ? './images/check.svg' : './images/pencil.svg';
          [...btn.childNodes].find(item => item.nodeName === 'IMG').alt = open ? 'check' : 'pencil';
  
          inputs[index_btn].classList.toggle('hide');
          names_tasks[index_btn].classList.toggle('hide');
          btn.classList.toggle('blue-btn');
  
          columns[num_column].tasks[index_btn].title = inputs[index_btn].value;

          doneTask();

          if (!open) {
            saveInLocalStorage('columns', JSON.stringify(columns));
            executeAllControlFunctions();
          }

          inputs[index_btn].focus();
        }); 
      });
    });
  }

  changeTextTasks();

  function changeColorThemeColumns() {
    columns.map((column, index_column) => {
      const btns_change_color_theme = document.querySelectorAll('.wrapper__block-header-change-color-theme-column-btn');
      const columns_blocks = document.querySelectorAll('.wrapper__block');
      const color_theme_blocks = document.querySelectorAll('.wrapper__block-color-theme');
      const btn_close_color_theme = document.querySelectorAll('.wrapper__block-color-theme-btn');
      const colors_items = document.querySelectorAll(`.wrapper__block-color-theme-list[data-column="${index_column}"] li`);
  
      const hideAllColumns = () => columns_blocks.forEach(column => column.style.zIndex = '-1');
      const showActiveColumn = index => columns_blocks[index].style.zIndex = '99999';
  
      const hideAllColors = () => colors_items.forEach(item => item.classList.remove('active-color'));
      const showActiveColor = index => colors_items[index].classList.add('active-color');

      btns_change_color_theme.forEach((btn, index_btn) => {
        btn.addEventListener('click', () => {
          document.documentElement.classList.add('dark-background');
          color_theme_blocks[index_btn].style.zIndex = '1';
          
          hideAllColumns();
          showActiveColumn(index_btn);
  
          colors_items.forEach((color, index_color) => {
            const data = color.dataset.colorTheme;
            
            color.addEventListener('click', () => {
              hideAllColors();
              showActiveColor(index_color);

              for (let i in colors_theme) {
                if (data === i) {
                  columns[index_btn].color_theme = colors_theme[i];
                }
              }
            });

            for (let i in colors_theme) {
              if (data === i && colors_theme[i].background === columns[index_btn].color_theme.background) {
                color.classList.add('active-color');
              }
            }
          });

          btn_close_color_theme[index_btn].addEventListener('click', () => {
            document.documentElement.classList.remove('dark-background');
            color_theme_blocks[index_btn].style.zIndex = '-1';
            columns_blocks.forEach(column => column.style.zIndex = '0');
            saveInLocalStorage('columns', JSON.stringify(columns));
            executeAllControlFunctions();
          });
        });
      });
    });
  }

  changeColorThemeColumns();

  function createColumnsBlock() {
    const list = document.querySelector('.wrapper__blocks');

    list.innerHTML = '';

    columns.map((column, index) => {
      const block = `
      <div class="wrapper__block">
        <header class="wrapper__block-header" style="background: ${column.color_theme.background}; border-bottom: 1.5px solid ${column.color_theme.border};">
          <div class="wrapper__block-header-item">
            <h3 class="wrapper__block-header-title">${column.title}</h3>
            <input class="wrapper__block-header-title-change-column change-text-input hide" type="text" value="${column.title}" />
          </div>
          <div class="wrapper__block-header-item wrapper__block-header-settings-column hide">
            <button class="wrapper__block-header-remove"></button>
            <button class="wrapper__block-header-change-color-theme-column-btn">
              <img src="./images/palette.svg" alt="palette"></img>
            </button>
            <button class="wrapper__block-header-change-column-text-btn">
              <img src="./images/pencil.svg" alt="pencil" />
            </button>
          </div>
        </header>
        <main class="wrapper__block-main" style="background: ${column.color_theme.background}; border-bottom: 1.5px solid ${column.color_theme.border};">
          <ul class="wrapper__block-main-tasks" data-list-num="${index}"></ul>
        </main>
        <footer class="wrapper__block-footer" style="background: ${column.color_theme.background}; border-top: 1.5px solid ${column.color_theme.border};">
          <div class="wrapper__block-footer-total-tasks">
            ${setSizeTasks(index)}
          </div>
          <div class="wrapper__block-footer-add-new-task">
            <button class="wrapper__block-footer-add-new-task-btn">Добавить новую задачу</button>
          </div>
        </footer>
        <div class="wrapper__block-form hide" style="background: ${column.color_theme.background}">
          <input class="wrapper__block-form-task-name form-text" type="text" placeholder="Название задачи">
          <button class="wrapper__block-form-task-btn form-btn" data-form-btn="add">Добавить задачу</button>
          <button class="wrapper__block-form-task-btn form-btn form-btn-cancel" data-form-btn="cancel">Отмена</button>
        </div>
        <div class="wrapper__block-color-theme" style="background: ${column.color_theme.background};">
          <h2 class="wrapper__block-color-theme-heading">Выберите задний фон столбца: "${column.title}"</h2>
          <ul class="wrapper__block-color-theme-list" data-column="${index}"></ul>
          <button class="wrapper__block-color-theme-btn blue-btn">
            <img src="./images/check.svg" alt="check" />
          </button>
        </div>
      </div>
      `;

      list.innerHTML += block;
    });

    const lists_colors_theme = document.querySelectorAll('.wrapper__block-color-theme-list');

    lists_colors_theme.forEach(list => {
      for (let i in colors_theme) {
        const item = `<li class="wrapper__block-color-theme-list-item" data-color-theme="${i}" style="background: ${colors_theme[i].background}; border: 1px solid ${colors_theme[i].border}"></li>`;

        list.innerHTML += item;
      }
    });

    createTasksBlock();
  }

  function createTasksBlock() {
    const lists = document.querySelectorAll('.wrapper__block-main-tasks');

    lists.forEach(list => list.innerHTML = '');

    columns.map((column, idx) => {
      column.tasks.map((task, index) => {
        const block = `
        <li class="wrapper__block-main-tasks-item" data-column="${idx}" data-num-task="${index}">
          <label for="checkbox-${idx}-${index}">
            <div class="wrapper__block-main-tasks-item-block">
              <input class="wrapper__block-main-tasks-item-checkbox" type="checkbox" id="checkbox-${idx}-${index}" ${task.check ? 'checked' : ''} data-column="${idx}" />
              <span class="wrapper__block-main-tasks-item-check" style="border: 1px solid ${column.color_theme.border}"></span>
            </div>
            <div class="wrapper__block-main-tasks-item-block">
              <div class="wrapper__block-main-tasks-item-name ${task.check ? 'done-task' : ''}" data-column="${idx}">${task.title}</div>
              <input class="wrapper__block-main-tasks-item-change-task-name change-text-input hide" type="text" value="${task.title}" data-column="${idx}" />
            </div>
            <div class="wrapper__block-main-tasks-item-block wrapper__block-main-tasks-item-date">
              <button class="wrapper__block-main-tasks-item-date-remove-task-btn hide" data-column="${idx}"></button>
              <button class="wrapper__block-main-tasks-item-date-change-task-btn hide" data-column="${idx}">
                <img src="./images/pencil.svg" alt="pencil" />
              </button>
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
              const checkbox = document.querySelector(`.wrapper__block-main-tasks-item-checkbox[data-column="${selected_task.column_num}"]`);
              const btn_remove_task = document.querySelector(`.wrapper__block-main-tasks-item-date-remove-task-btn[data-column="${selected_task.column_num}"]`);
              const btn_change_task = document.querySelector(`.wrapper__block-main-tasks-item-date-change-task-btn[data-column="${selected_task.column_num}"]`);

              label.for = `checkbox-${drop_zone_num}-${index_task}`;
              checkbox.id = `checkbox-${drop_zone_num}-${index_task}`;
              checkbox.dataset.column = drop_zone_num;

              btn_remove_task.dataset.column = drop_zone_num;
              btn_change_task.dataset.column = drop_zone_num;
  
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
    changeColorThemeColumns();
    changeTextTasks();
    changeTextColumns();
    removeTasks();
    dragAndDrop();
    doneTask();
  }
}

todoList();