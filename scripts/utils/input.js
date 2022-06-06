export function input({label, id, name, type, placeholder = "", required = false, value = false}) {
  return `
  <div class="input">
    ${ label ?
      `<label for="${id}" class="label" >${label}</label>`
      : ""
    }
    <div class="input__container">
      <input
        type="${type ? type : "text" }"
        placeholder="${placeholder}"
        class="input__content"
        id="${id}"
        name="${name ? name: id}"
        ${value ? `value="${value}"` : ""}
        ${required ? "required" : ""}
      >
    </div>
  </div>
  `
}