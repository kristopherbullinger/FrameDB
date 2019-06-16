let form = document.querySelector(".login-form-container");

const generateLoginForm = (e) => {
  e.preventDefault();
  form.classList.remove("hidden");
};

const hideLoginForm = e => {
  form.classList.add("hidden");
}

document.querySelector("#login").addEventListener("click", generateLoginForm);
document.querySelector(".login-form .cancel").addEventListener("click", hideLoginForm)
