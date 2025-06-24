const formulario = document.querySelector(".login__form");

const inputEmail = formulario.querySelector("#email");
const inputPassword = formulario.querySelector("#password");
const buttonLogin = formulario.querySelector("#js-button-login");
const message = formulario.querySelector("#message-login");

function inhabilitarBoton() {
  //trim elimina los espacios en blanco antes y despues del texto
  const emailCompleto = inputEmail.value.trim() != "";
  const passwordCompleto = inputPassword.value.trim() != "";
  const emailVerificado = verificarEmail(inputEmail.value.trim());

  if (
    emailCompleto == false ||
    emailVerificado == false ||
    passwordCompleto == false
  ) {
    buttonLogin.disabled = true;
  } else {
    buttonLogin.disabled = false;
  }
}

function verificarEmail(emailCompleto) {
  if (emailCompleto.includes("@") && emailCompleto.includes(".")) {
    return true;
  }
  return false;
}

inhabilitarBoton();
inputEmail.addEventListener("input", inhabilitarBoton);
inputPassword.addEventListener("input", inhabilitarBoton);
formulario.addEventListener("submit", (event) => {
  event.preventDefault(); // Evitar el envío del formulario

  message.textContent = "";
  message.classList.remove("error");
  message.classList.remove("exito");

  // Validar que el usuario esté registrado
  if (!localStorage.getItem(inputEmail.value)) {
    message.classList.add("error");
    message.textContent = "Usuario no registrado";
    return;
  }

  //Obtener el usuario del localStorage
  const user = JSON.parse(localStorage.getItem(inputEmail.value));

  // Validar la contraseña
  if (user.password !== inputPassword.value) {
    message.textContent = "Contraseña Incorrecta";
    message.classList.add("error");
    return;
  }
  // Guardar el usuario en sessionStorage
  sessionStorage.setItem("user", JSON.stringify(user));

  message.textContent = "Iniciando sesión...";

  setTimeout(() => {
    window.location.href = "/pages/home.html"; // Redirigir a la página de inicio
  }, 2500);
});
