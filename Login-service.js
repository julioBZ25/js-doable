import apiFetch from "./api-fetch.js";
import { tokenKey } from "./config.js";

export async function login(credentials = { email, password }) {

  const token = await apiFetch("login", { body: credentials })

  sessionStorage.setItem(tokenKey, JSON.stringify(token.token))
}