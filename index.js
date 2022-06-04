import DOMHandler from "./scripts/utils/DOM.js";
import { tokenKey } from "./scripts/utils/config.js";
import LoginPage from "./scripts/pages/Login-page.js";
import HomePage from "./scripts/pages/Home-page.js";
import STORE from "./scripts/store.js";

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