import DOMHandler from "./DOM.js";
import { input } from "./input.js";
import LoginPage from "./Login-page.js";
import { logout } from "./Login-service.js";
import STORE from "./store.js";
import { createTask, updateTask } from "./task-service.js";


const CHECKBOX_VALUES = {
  pending: false,
  import: false
}

const SORT_BY_HANDLER = {
  alpha: {
    comparator: (a,b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
  },
  date: {
    comparator: (a, b) => new Date(a.due_date) - new Date(b.due_date),
  },
  import: {
    comparator: (a, b) => Number(b.important) - Number(a.important),
  },
}

let SELECTED_VALUE = ''

const HomePage = (function() {
  function renderTask(task){
    return `
    <li class= "task-card">
      ${
        task.completed ? `<input type='checkbox' id='completedTask' data-id=${task.id} checked>` : `<input type='checkbox' data-id=${task.id} id='completedTask'>`
      }
      <div>${task.completed}</div>
      <div>
        <div>
          ${task.title}
        </div>
        ${task.due_date ? `<div>${task.due_date}</div>` : ''}
      </div>
      <div>
        ${task.important ? `<input type='checkbox' id='importantTask' checked>` : `<input type='checkbox' id='importantTask'>`}
      </div>
    </li>`
  }

  const generateTemplate = function() { 
    const listTasks = STORE.filtered.length ? STORE.filtered : STORE.tasks
    const { createError } = createForm.state
    return `
      <header class= "navbar">
        <div class= "logo">
          <img src="./assets/img/doable.png" alt="logo">
        </div>
        <div class="logout">
          <a class="js-logout">
            <img src="./assets/img/Icon.png" alt="logout">
          </a>
        </div>
      </header>
      <section class="sort-section">
        <p>Sort</p>
        <div class="js-sortBy">
          <select name="sortBy" id="sortBy">
            <option value="" disabled ${SELECTED_VALUE ? '' : 'selected'}>Select your option</option>
            <option value="alpha" ${SELECTED_VALUE === 'alpha' ? 'selected' : ''}>Alphabetical (a-z)</option>
            <option value="date" ${SELECTED_VALUE === 'date'  ? 'selected' : ''}>Due date</option>
            <option value="import" ${SELECTED_VALUE === 'import'  ? 'selected' : ''}>Importance</option>
          </select>
        </div>
      </section>
      <section class="show-section">
        <p>Show</p>
        <div class="js-showBy">        
          <input type="checkbox" id="pending" name="pending" value="pending" ${CHECKBOX_VALUES.pending ? 'checked' : ''}>
          <label for="pending">Only pending</label>
          <input type="checkbox" id="import" name="import" value="import" ${CHECKBOX_VALUES.import ? 'checked' : ''}>
          <label for="import">Only important</label>
        </div>
      </section>
      <section class="tasks-section">
        <ul class="tasks-container" role="list">
          ${listTasks.map(task => renderTask(task)).join("")}
        </ul>
      </section>
      <section class="newTasks-container">
        <form class="js-new-task-form">
          ${input({
            label: "title",
            id: "title",
            type: "title",
            placeholder: "What things you don't need to forget?",
          })}
          ${input({
            label: "Due date",
            id: "due_date",
            type: "due_date",
            placeholder: "mm / dd / yy",
          })}
          ${createError ? 
            `<p>${createError}</p>`: ''
          }
          <button class="js-new-task-submit">Create Task</button>
        </form>
      </section>
      </section>
    `
  }

  function listenCompletedTask(){
    const completedCheckbox = document.querySelector('#completedTask')

    completedCheckbox.addEventListener('change', async (event) => {
      event.preventDefault()

      const {checked, dataset: {id}} = event.target

      await updateTask(id, { completed: checked })
      const task = STORE.tasks.find(a => a.id.toString() === id)
      task.completed = checked
    })
  }

  function listenLogout() {
    const Logout = document.querySelector(".js-logout")

    Logout.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        await logout()
        DOMHandler.load(LoginPage);
      } catch (error){
        console.log(error.message);
      }
      })
  }

  function listenSortBy() {
    const sortBy =  document.getElementById('sortBy')
  
    sortBy.addEventListener("change", (event) => {
      try {
        const handler = SORT_BY_HANDLER[event.target.value]
        SELECTED_VALUE = event.target.value
        STORE.tasks.sort(handler.comparator)
        DOMHandler.reload()
      } catch (error) {
        DOMHandler.reload()
      }
    })
  }

  function listenShowBy() {
    const showBy =  document.querySelector('.js-showBy')
    showBy.addEventListener("change", (event) => {
      try {
        event.preventDefault()
        switch (event.target.value) {
          case "pending":
            console.log("pending")
            CHECKBOX_VALUES.pending = event.target.checked
            if(event.target.checked){
              STORE.filtered = STORE.tasks.filter(a => !a.completed)
              break;
            }else{
              STORE.filtered = []
              break;
            }
          case "import":
            console.log("import")
            CHECKBOX_VALUES.import = event.target.checked
            if(event.target.checked){
              STORE.filtered = STORE.tasks.filter(a => a.important)
              break;
            }else{
              STORE.filtered = []
              break;
            }
        }
        DOMHandler.reload()
      } catch (error) {
        DOMHandler.reload()
      }
    })
  }

  function listenSubmitTask(){
    const form = document.querySelector(".js-new-task-form")

    form.addEventListener("submit", async (event) => {
      try{
        event.preventDefault();
        createForm.state.createError = null

        const { title: {value: titleValue}, due_date: {value: due_dateValue} } = event.target

        if (!titleValue){
          throw new Error("Title must be complete")
        }
        await createTask({
          title: titleValue,
          due_date: due_dateValue
        })
        DOMHandler.reload()
      }catch(error){
        createForm.state.createError = error.message
        DOMHandler.reload()
      }
    })
  }

  const createForm = {
    state:{
      createError: null,
    }
  }

  return {
    toString() {
      return generateTemplate()
    },
    addListeners() {
      listenSortBy()
      listenLogout()
      listenShowBy()
      listenSubmitTask()
      listenCompletedTask()
    }
  }
})()

export default HomePage;