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
  const buttonSubmit = document.getElementById("js-buttonSubmit");
  const userName = document.getElementById("js-name");
  const userLastName = document.getElementById("js-surName");
  const userNickName = document.getElementById("js-nickName");
  const email = document.getElementById("js-email");
  const password = document.getElementById("js-password");
  const repeatPassword = document.getElementById("js-repeatPassword");
  const paymentMethods = document.querySelectorAll(".js-payment");
  const creditCardNumber = document.getElementById("js-creditCard");
  const creditCardCode = document.getElementById("js-creditCardCode");
  const inputRapipago = document.getElementById("js-rapiPago");
  const inputPagoFacil = document.getElementById("js-pagoFacil");

  const regexLetters = /^[a-zA-Z]+$/;
  const regexLettersAndNumbers = /^[a-zA-Z0-9]+$/;

  // Regex para validar el nickNAme solo acepta letras y numeros
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexCreditCardCode = /^[1-9]{3}$/;
  const regexCreditCard = /^\d{16}$/;

  const isNameValid = regexLetters.test(userName.value);
  const isLastNameValid = regexLetters.test(userLastName.value);
  const isEmailValid = emailRegex.test(email.value);
  const isPasswordValid = validarPassword(password.value);
  const isRepeatPasswordValid = password.value === repeatPassword.value;
  const isNickNameValid = regexLettersAndNumbers.test(userNickName.value);

  let isPaymentMethodCreditCard = false;
  let isPaymentMethodcuponPago = false;
  let isPaymenyMethodCBU = false;
  let isCreditCardNumberValid = false;
  let isCreditCardCodeValid = false;

  paymentMethods.forEach((method) => {
    if (method.checked) {
      if (method.value === "cuponPago") {
        isPaymentMethodcuponPago = true;
        inputRapipago.disabled = false;
        inputPagoFacil.disabled = false;
      }

      if (method.value === "transferencia") {
        isPaymenyMethodCBU = true;
      }

      if (method.value === "tarjetaCredito") {
        isPaymentMethodCreditCard = true;
        creditCardCode.disabled = false;
        creditCardNumber.disabled = false;
        isCreditCardNumberValid = validateCreditCard(
          creditCardNumber.value,
          regexCreditCard
        );
        isCreditCardCodeValid = regexCreditCardCode.test(creditCardCode.value);
      }
    }
  });

  let isFormValid = false;

  if (!isPaymentMethodCreditCard) {
    creditCardCode.disabled = true;
    creditCardNumber.disabled = true;
  }

  if (!isPaymentMethodcuponPago) {
    inputRapipago.disabled = true;
    inputPagoFacil.disabled = true;
  }

  if (
    isNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isNickNameValid &&
    isPasswordValid &&
    isRepeatPasswordValid
  ) {
    user.name = userName.value;
    user.surName = userLastName.value;
    user.nickName = userNickName.value;
    user.email = email.value;
    user.password = password.value;

    if (isPaymentMethodCreditCard) {
      if (isCreditCardNumberValid && isCreditCardCodeValid) {
        isFormValid = true; // El formulario es válido si todos los campos son correctos
        user.paymentMethod = "tarjetaCredito";
        user.creditCard = creditCardNumber.value;
        user.creditCardCode = creditCardCode.value;
      }
    } else {
      isFormValid = true; // Si no es tarjeta de crédito, el formulario es válido
      if (isPaymentMethodcuponPago) {
        user.paymentMethod = "cuponPago";
        user.rapiPago = inputRapipago.checked;
        user.pagoFacil = inputPagoFacil.checked;
      }
      if (isPaymenyMethodCBU) {
        user.paymentMethod = "transferencia";
      }
    }
    console.log("user", user);
  }

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

  buttonSubmit.disabled = !isFormValid;
}

function registerValidation() {
  const registerForm = document.getElementById("registerForm");
  const inputs = registerForm.querySelectorAll("input");

  inputs.forEach((input) => {
    const type = input.type;

    if (type === "checkbox" || type === "radio" || input.tagName === "SELECT") {
      input.addEventListener("change", checkFormValidity);
    } else {
      input.addEventListener("input", checkFormValidity);
    }
  });

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el envío del formulario para validar los campos

    if (localStorage.getItem(user.email)) {
      alert("Ya existe un usuario con este email.");
      return;
    }

    localStorage.setItem(user.email, JSON.stringify(user));
    alert("Usuario registrado correctamente.");

    window.location.href = "/index.html"; // Redirige al index después de registrar
  });
}

registerValidation();

function validarPassword(password) {
  if (password.length != 8) return false;

  let letras = 0;
  let numeros = 0;
  let especiales = 0;

  for (let char of password) {
    if (/[a-zA-Z]/.test(char)) {
      letras++;
    } else if (/[0-9]/.test(char)) {
      numeros++;
    } else {
      especiales++;
    }
  }

  return letras >= 2 && numeros >= 2 && especiales >= 2;
}

function validateCreditCard(creditCardNumber, regexCreditCard) {
  // Validar que tenga exactamente 16 dígitos numéricos

  if (!regexCreditCard.test(creditCardNumber)) {
    return false;
  }

  // Sumar los primeros 15 dígitos (excluyendo el último)
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
    console.log("Número de tarjeta inválido por regla personalizada");
    return false;
  }

  return true;
}
