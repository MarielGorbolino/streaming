/*---------------------- RECUPERAR CUENTA ---------------------- */
function recover() {
  /* Traemos los inputs del HTML por ID */
  const emailInput = document.getElementById("js-input-email");
  const userNickInput = document.getElementById("js-input-userNickName");

  /* Traemos los botones del HTML por id */
  const sendButton = document.getElementById("js-button-send");

  /* Traemos los span de errores del HTML por id */
  const errorEmail = document.getElementById("js-email-error");
  const errorNick = document.getElementById("js-nick-error");

  /* Expresiones regulares */
  const regexLettersAndNumbers = /^[a-zA-Z0-9]+$/; // Regex para validar nickName con letras y número
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex para validar email

  /* Eventos para validar inputs */
  emailInput.addEventListener("input", validate);
  userNickInput.addEventListener("input", validate);
  /* Evento para enviar email */
  sendButton.addEventListener("click", sendEmail);

  /*---------------------- VALIDAR EMAIL Y NOMBRE DE USUARIO ---------------------- */
  function validate() {
    let isFormValid = false; // con esta variable se habilita o deshabilita el botón por medio de la propiedad disable

    /* Test de expresiones regulares */
    const isEmailValid = emailRegex.test(emailInput.value);
    const isNickValid = regexLettersAndNumbers.test(userNickInput.value);

    /*----------- SPAN PARA MOSTRAR  ERRORES ----------- */

    /* Inicialmente no dirán nada pero si hay error insertamos una cadena de texto con el mensaje correspondiente */
    errorEmail.textContent = "";
    errorNick.textContent = "";

    if (!isEmailValid) errorEmail.textContent = "Email inválido.";

    if (!isNickValid)
      errorNick.textContent =
        "El nickName solo puede contener letras y números.";

    if (isEmailValid && isNickValid) isFormValid = true; // Formulario validado

    /* Activamos o desactivamos el botón según las validaciones */
    sendButton.disabled = !isFormValid;
  }

  /*---------------------- ENVIAR MAIL ---------------------- */
  function sendEmail(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem(emailInput.value));

    /* Si no devuelve nada arrojamos advertencia */
    if (!user) {
      alert("No se encontro un usuario con este mail registrado");
      return;
    }

    /* Si devolvio el usuario pero el nombre de usuario no coincide arrojamos advertencia */
    if (user.nickName !== userNickInput.value) {
      alert("El nombre de usuario no coincide con el registrado");
      return;
    }

    /* Simulamos envío de email y navegamos al login */
    alert("mail enviado con exito");
    window.location.href = "/index.html";
  }
}

recover();
