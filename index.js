import DOMHandler from "./DOM.js";
import { tokenKey } from "./config.js";
import STORE from "./store.js";
import HomePage from "./Home-page.js"
import LoginPage from "./Login-page.js";

async function init() {
  try{
    const token = sessionStorage.getItem("tokenKey")

    if(!token) throw new Error()

    await STORE.fetchTasks();
    DOMHandler.load(HomePage)
  } catch(error) {
    sessionStorage.removeItem(tokenKey);
    DOMHandler.load(LoginPage)
  }
}

init()