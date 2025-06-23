/* Datos del formulario serán guardados aquí */
const user = {
  name: null,
  surName: null,
  nickName: null,
  email: null,
  password: null,
  paymentMethod: null,
  creditCard: null,
  creditCardCode: null,
  rapiPago: null,
  pagoFacil: null,
  cbu: null,
};

function checkFormValidity() {
  let isFormValid = false; // Variable para verificar si el formulario es válido

  // Obtener los elementos del formulario
  const buttonSubmit = document.getElementById("js-buttonSubmit");
  const userName = document.getElementById("js-name");
  const userLastName = document.getElementById("js-surName");
  const userNickName = document.getElementById("js-nickName");
  const email = document.getElementById("js-email");
  const password = document.getElementById("js-password");
  const repeatPassword = document.getElementById("js-repeatPassword");
  const paymentMethods = document.querySelectorAll(".js-payment"); // Selecciona todos los métodos de pago
  const creditCardNumber = document.getElementById("js-creditCard");
  const creditCardCode = document.getElementById("js-creditCardCode");
  const inputRapipago = document.getElementById("js-rapiPago");
  const inputPagoFacil = document.getElementById("js-pagoFacil");

  const regexLetters = /^[a-zA-Z]+$/; // Regex para validar solo letras
  const regexLettersAndNumbers = /^[a-zA-Z0-9]+$/; // Regex para validar nickName con letras y número
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex para validar email
  const regexCreditCardCode = /^[1-9]{3}$/; // Regex para validar código de tarjeta (3 dígitos del 1 al 9)
  const regexCreditCard = /^\d{16}$/; // Regex para validar número de tarjeta (16 dígitos numéricos)

  const isNameValid = regexLetters.test(userName.value); // Validar nombre solo con letras
  const isLastNameValid = regexLetters.test(userLastName.value); // Validar apellido solo con letras
  const isEmailValid = emailRegex.test(email.value); // Validar email con regex
  const isPasswordValid = validarPassword(password.value); // Validar contraseña con la función personalizada
  const isRepeatPasswordValid = password.value === repeatPassword.value; // Validar que la contraseña repetida sea igual a la original esto devuelve un booleano (es como usar un if simplificado)
  const isNickNameValid = regexLettersAndNumbers.test(userNickName.value); // Validar nickName con letras y números

  let isPaymentMethodCreditCard = false; // Variable para verificar si se seleccionó el método de pago tarjeta de crédito
  let isPaymentMethodcuponPago = false; // Variable para verificar si se seleccionó el método de pago cuponPago
  let isPaymenyMethodCBU = false; // Variable para verificar si se seleccionó el método de pago transferencia
  let isCreditCardNumberValid = false; // Variable para verificar si el número de tarjeta es válido
  let isCreditCardCodeValid = false; // Variable para verificar si el código de tarjeta es válido

  /* paymentMethods es un array de inputs lo que hacemos aca es saber que se esta seleccionando en los inputs de tipo radio en base a eso habilitamos o no el contenido */
  paymentMethods.forEach((method) => {
    /* Comprobamos si el método de pago está seleccionado */
    if (method.checked) {
      if (method.value === "cuponPago") {
        isPaymentMethodcuponPago = true; // Verifica si se seleccionó el método de pago cuponPago
        inputRapipago.disabled = false; // Habilita el input de Rapipago
        inputPagoFacil.disabled = false; // Habilita el input de Pago Fácil
      }

      if (method.value === "transferencia") {
        isPaymenyMethodCBU = true; // Verifica si se seleccionó el método de pago transferencia
      }

      if (method.value === "tarjetaCredito") {
        isPaymentMethodCreditCard = true; // Verifica si se seleccionó el método de pago tarjeta de crédito
        creditCardCode.disabled = false; // Habilita el input del código de tarjeta
        creditCardNumber.disabled = false; // Habilita el input del número de tarjeta
        /* Funcion de validación de tarjeta de crédito (no lo hice todo con regex) */
        isCreditCardNumberValid = validateCreditCard(
          creditCardNumber.value,
          regexCreditCard
        );
        isCreditCardCodeValid = regexCreditCardCode.test(creditCardCode.value); // Validar código de tarjeta con regex
      }
    }
  });

  /* Si no se selecciona ningún método de pago, deshabilitamos los inputs correspondientes */
  if (!isPaymentMethodCreditCard) {
    creditCardCode.disabled = true;
    creditCardNumber.disabled = true;
  }

  /* Si no se selecciona el método de pago cuponPago, deshabilitamos los inputs de Rapipago y Pago Fácil */
  if (!isPaymentMethodcuponPago) {
    inputRapipago.disabled = true;
    inputPagoFacil.disabled = true;
  }

  /* Comprobamos si todos los campos son válidos */
  if (
    isNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isNickNameValid &&
    isPasswordValid &&
    isRepeatPasswordValid
  ) {
    // Si todos los campos son válidos, asignamos los valores al objeto user para proximamente guardarlos en localStorage
    user.name = userName.value;
    user.surName = userLastName.value;
    user.nickName = userNickName.value;
    user.email = email.value;
    user.password = password.value;

    // Verificamos si se seleccionó el método de pago tarjeta de crédito
    if (isPaymentMethodCreditCard) {
      if (isCreditCardNumberValid && isCreditCardCodeValid) {
        isFormValid = true; // El formulario es válido si todos los campos son correctos
        user.paymentMethod = "tarjetaCredito"; // Asignamos el método de pago tarjeta de crédito
        user.creditCard = creditCardNumber.value; // Asignamos el número de tarjeta
        user.creditCardCode = creditCardCode.value; // Asignamos el código de tarjeta
      }
    } else {
      isFormValid = true; // Si no es tarjeta de crédito, el formulario es válido
      // Asignamos el método de pago según la selección
      if (isPaymentMethodcuponPago) {
        user.paymentMethod = "cuponPago";
        user.rapiPago = inputRapipago.checked;
        user.pagoFacil = inputPagoFacil.checked;
      }
      if (isPaymenyMethodCBU) {
        user.paymentMethod = "transferencia";
      }
    }
  }

  /* ----------------------- Manejo de errores usando if ternarios (más simplificado) ----------------------- */
  /* variable = condición? true : false 
  Uso directamente el valor booleano de las variables para asignar los mensajes de error todo directo usando document.getELementById 
  no es necesario crear variables adicionales para los mensajes de error, ya que se puede asignar directamente el texto de error en caso de que la condición sea falsa.
  ES decir se modifica el contenido directamente del HTML 
  */

  /*  Actualizamos los mensajes de error en el formulario */

  document.getElementById("error-name").textContent = isNameValid
    ? ""
    : "Nombre inválido. Solo letras.";
  document.getElementById("error-surName").textContent = isLastNameValid
    ? ""
    : "Apellido inválido. Solo letras.";
  document.getElementById("error-email").textContent = isEmailValid
    ? ""
    : "Email inválido.";

  document.getElementById("error-nickName").textContent = isNickNameValid
    ? ""
    : "El nickName solo puede contener letras y números.";

  document.getElementById("error-password").textContent = isPasswordValid
    ? ""
    : "La contraseña debe tener 8 caracteres con mínimo 2 letras, 2 números y 2 especiales.";
  document.getElementById("error-repeatPassword").textContent =
    isRepeatPasswordValid ? "" : "Las contraseñas no coinciden.";

  // Verificamos si se seleccionó algún método de pago caso correcto mostramos los errores correspondientes caso falso ocultamos los errores
  if (isPaymentMethodCreditCard) {
    document.getElementById("error-creditCard").textContent =
      isCreditCardNumberValid ? "" : "Número de tarjeta inválido.";
    document.getElementById("error-creditCardCode").textContent =
      isCreditCardCodeValid
        ? ""
        : "Código inválido. Deben ser 3 dígitos del 1 al 9.";
  } else {
    document.getElementById("error-creditCard").textContent = "";
    document.getElementById("error-creditCardCode").textContent = "";
  }

  // si esta todo bien se habilita el botón de submit caso contrario se deshabilita
  buttonSubmit.disabled = !isFormValid;
}

function registerValidation() {
  const registerForm = document.getElementById("registerForm"); // Selecciona el formulario de registro
  const inputs = registerForm.querySelectorAll("input"); // Selecciona todos los inputs del formulario

  /* Agrega un evento de cambio o entrada a cada input del formulario para verificar la validez del formulario */
  inputs.forEach((input) => {
    const type = input.type;

    // Si es checkbox, radio o select, usamos 'change' para detectar cambios
    // Si es otro tipo de input, usamos 'input' para detectar cambios en el valor
    // Mas que nada por que el tipo input detecta cuando el usuario escribe en el campo
    // y el tipo change detecta cuando se cambia el valor de un checkbox, radio o select
    if (type === "checkbox" || type === "radio" || input.tagName === "SELECT") {
      input.addEventListener("change", checkFormValidity); // Detecta cambios en checkbox, radio o select
    } else {
      input.addEventListener("input", checkFormValidity); // Detecta cambios en otros tipos de input
    }
  });

  // Agrega un evento de envío al formulario para manejar el registro
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el envío del formulario para validar los campos

    // Verifica si existe usuario con el mismo email
    if (localStorage.getItem(user.email)) {
      alert("Ya existe un usuario con este email.");
      return;
    }

    //Guarda los datos del usuario en el objeto user en localStorage
    localStorage.setItem(user.email, JSON.stringify(user));
    alert("Usuario registrado correctamente.");

    window.location.href = "/index.html"; // Redirige al index después de registrar
  });
}

registerValidation();

function validarPassword(password) {
  if (password.length != 8) return false; // Validar longitud de 8 caracteres

  let letras = 0; // Contador de letras
  let numeros = 0; // Contador de números
  let especiales = 0; // Contador de caracteres especiales

  // Contar letras, números y caracteres especiales
  for (let char of password) {
    // Expresión Regular para letras si devuelve true significa que es una letra  entonces aumentamos el contador
    // Caso contrario si el regex de numeros devuelve false entonces aumentamos el contador de numeros pero si el regex de numeros es false entonces es caracter especial
    if (/[a-zA-Z]/.test(char)) {
      letras++;
    } else if (/[0-9]/.test(char)) {
      numeros++;
    } else {
      especiales++;
    }
  }

  // Retornamos con ternario si cumple con la condición de tener al menos 2 letras, 2 números y 2 caracteres especiales
  // Si cumple con la condición devuelve true caso contrario false
  return letras >= 2 && numeros >= 2 && especiales >= 2;
}

function validateCreditCard(creditCardNumber, regexCreditCard) {
  // Validar que tenga exactamente 16 dígitos numéricos

  if (!regexCreditCard.test(creditCardNumber)) {
    return false;
  }

  // Sumar los primeros 15 dígitos (excluyendo el último)
  // Uso parseInt para convertir cada carácter a número entero
  let count = 0;
  for (let i = 0; i < creditCardNumber.length - 1; i++) {
    const digit = parseInt(creditCardNumber[i]);
    count += digit;
  }

  // Último dígito
  const lastDigit = parseInt(creditCardNumber[creditCardNumber.length - 1]);

  // Validar la regla personalizada
  const sumaEsPar = count % 2 === 0;
  const ultimoEsPar = lastDigit % 2 === 0;

  if ((sumaEsPar && ultimoEsPar) || (!sumaEsPar && !ultimoEsPar)) {
    return false;
  }

  return true;
}
