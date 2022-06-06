import HomePage from "./Home-page.js"
import LoginPage from "./Login-page.js";
import { input } from "../utils/input.js";
import { signup } from "../services/auth-services.js";
import DOMHandler from "../utils/DOM.js";

function render() {
  const { signUpError } = signUpPage.state;
  return `
      <section class="container">
        <div class="signup-title">
          <h1>Sign Up</h1>
        </div>
          <form class="flex flex-column gap-4 mb-4 js-signup-form">
          ${input({
            label: "email",
            id: "email",
            type: "email",
            placeholder: "tumail@mail.com",
            required: true,
          })}
          ${input({
            label: "password",
            id: "password",
            type: "password",
            placeholder: "******",
            required: true,
          })}
          ${signUpError ? 
            `<p class="text-center error-300">${signUpError}</p>`: ''
          }
          <div class="signup-button-container">
            <button class="js-signup-button">SignUp</button>
          </div>  
        </form>
        <div class="login-link-container">
          <a href="#" class="block text-center js-login-link">login</a>
        </div>
      </section>
  `
}

function listenSubmitForm() {
  const form =  document.querySelector(".js-signup-form")

  form.addEventListener("submit", async (event) => {
    try {
      event.preventDefault();

      const { email, password } = event.target;
      await signup({
        email: email.value,
        password: password.value,
      })

      DOMHandler.load(HomePage)
    } catch (error) {
      signUpPage.state.signUpError = error.message
      DOMHandler.reload()
    }
  })
}

function listenLogInPage() {
  const form =  document.querySelector(".js-login-link")

  form.addEventListener("click",  (event) => {
    event.preventDefault()
    DOMHandler.load(LoginPage)
  })
}

const signUpPage = {
  toString() {
    return render()
  },
  addListeners() {
    listenSubmitForm()
    listenLogInPage()
  },
  state: {
    signUpError: null,
  }
}

export default signUpPage;