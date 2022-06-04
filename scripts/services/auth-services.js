import { tokenKey } from "../utils/config.js";
import apiFetch from "../api-fetch.js"

export async function login(credentials = { email, password }) {
  const token = await apiFetch("login", { body: credentials })
  sessionStorage.setItem(tokenKey, JSON.stringify(token.token))
}

export async function logout() {
  await apiFetch("logout", { method: "DELETE" })
  sessionStorage.removeItem(tokenKey)
}

export async function signup(credentials = { email, password }) {
  const token = await apiFetch("signup", { body: credentials })
  sessionStorage.setItem(tokenKey, JSON.stringify(token.token))
}