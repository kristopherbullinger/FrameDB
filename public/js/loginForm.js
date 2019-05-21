const generateLoginForm = (e) => {
  e.preventDefault();
  let form = document.querySelector(".login-form-container");
  if (form) {
    form.classList.remove("hidden");
    return;
  }
  form = `
  <div class="login-form-container">
    <form class="login-form" action="/auth/login" method="POST">
      <label for="username">username</label><br>
      <input name="username" value=""><br>
      <label for="password">password</label><br>
      <input name="password" value=""><br>
      <div class="button-container">
        <button type="submit" class="submit" style="min-width: 40%;">Log In</button>
        <button class="cancel" form="null" style="min-width: 40%;">Cancel</button>
      </div>
    </form>
  </div>
  `
  document.body.innerHTML += form;
  document.querySelector(".login-form .cancel").addEventListener("click", hideLoginForm)
};

const hideLoginForm = () => {
  let form = document.querySelector(".login-form-container");
  form.classList.add("hidden");
}
document.querySelector("#login").addEventListener("click", generateLoginForm);
