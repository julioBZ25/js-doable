import { input } from "../utils/input.js";
import { login } from "../services/auth-services.js"
import DOMHandler from "../utils/DOM.js";
import HomePage from "./Home-page.js"
import STORE from "../store.js";
import signUpPage from "./CreateUser-page.js";
import { Header } from "./header.js";

function render() {
  const { loginError } = LoginPage.state;
  return `
      ${Header}
      <section class="container">
        <div class="login-title">
          <h1 class="">Login</h1>
        </div>
        <form class="js-login-form">
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
          <div class="login-button-container">
            <button class="js-login-button">Login</button>
          </div>
        </form>
        <div class="signup-link-container">
          <a href="#" class="js-signup-link">Create account</a>
        </div>
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

function listenSignUpPage() {
  const form =  document.querySelector(".js-signup-link")

  form.addEventListener("click",  (event) => {
    event.preventDefault()

    DOMHandler.load(signUpPage)
  })
}

const LoginPage = {
  toString() {
    return render()
  },
  addListeners() {
    listenSubmitForm()
    listenSignUpPage()
  },
  state: {
    loginError: null,
  }
}

export default LoginPage;