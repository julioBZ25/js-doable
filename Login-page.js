import { input } from "./input.js";
import { login } from "./Login-service.js"
import DOMHandler from "./DOM.js";
import HomePage from "./Home-page.js"
import STORE from "./store.js";


function render() {
  // const { loginError } = this.state;
  const { loginError } = LoginPage.state;
  return `
      <section class="container">
        <h1 class="heading heading--lg text-center mb-4">Login</h1>
        <form class="flex flex-column gap-4 mb-4 js-login-form">
          ${input({
            label: "email",
            id: "email",
            type: "email",
            placeholder: "tumail@mail.com",
            required: true,
            value: "testdoable@mail.com"
          })}
          ${input({
            label: "password",
            id: "password",
            type: "password",
            placeholder: "******",
            required: true,
            value: "123456"
          })}
          ${loginError ? 
            `<p class="text-center error-300">${loginError}</p>`: ''
          }
          <button class="button button--primary">Login</button>
        </form>
        <a href="#" class="block text-center js-signup-link">Create account</a>
      </section>
  `;
}

function listenSubmitForm() {
  const form =  document.querySelector(".js-login-form")

  form.addEventListener("submit", async (event) => {
    try {
      event.preventDefault();
  
      const { email, password } = event.target;
  
      const credentials = {
        email: email.value,
        password: password.value,
      }
  
      await login(credentials)

      await STORE.fetchTasks()
      DOMHandler.load(HomePage)
    } catch (error) {
      LoginPage.state.loginError = error.message
      DOMHandler.reload()
    }
  })
}

const LoginPage = {
  toString() {
    // return render.call(this)
    return render()
  },
  addListeners() {
    // listenSubmitForm.call(this)
    return listenSubmitForm()
  },
  state: {
    loginError: null,
  }
}

export default LoginPage;