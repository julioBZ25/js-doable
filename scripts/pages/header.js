export const Header = (function() {
  const template = `
  <header class= "navbar">
    <div class= "logo">
      <img src="./assets/img/doable.png" alt="logo">
    </div>
    <div class="logout">
      <a class="js-logout">
        <img src="./assets/img/icon.png" alt="logout">
      </a>
    </div>
  </header>`

  return {
    toString() {
      return template
    }
  }
})()