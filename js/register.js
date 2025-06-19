function checkFormValidity() {
  const buttonSubmit = document.getElementById("js-buttonSubmit");
  const userName = document.getElementById("js-name");
  const userLastName = document.getElementById("js-surName");
  const email = document.getElementById("js-email");
  const password = document.getElementById("js-password");
  const repeatPassword = document.getElementById("js-repeatPassword");
  const paymentMethods = document.querySelectorAll(".js-payment");
  const creditCardNumber = document.getElementById("js-creditCard");
  const creditCardCode = document.getElementById("js-creditCardCode");
  const inputRapipago = document.getElementById("js-rapiPago");
  const inputPagoFacil = document.getElementById("js-pagoFacil");

  const regexLetters = /^[a-zA-Z]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexCreditCardCode = /^[1-9]{3}$/;
  const regexCreditCard = /^\d{16}$/;

  const isNameValid = regexLetters.test(userName.value);
  const isLastNameValid = regexLetters.test(userLastName.value);
  const isEmailValid = emailRegex.test(email.value);
  const isPasswordValid = validarPassword(password.value);
  const isRepeatPasswordValid = password.value === repeatPassword.value;

  let isPaymentMethodCreditCard = false;
  let isPaymentMethodcuponPago = false;
  let isCreditCardNumberValid = false;
  let isCreditCardCodeValid = false;

  paymentMethods.forEach((method) => {
    if (method.checked) {
      if (method.value === "cuponPago") {
        isPaymentMethodcuponPago = true;
        inputRapipago.disabled = false;
        inputPagoFacil.disabled = false;
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

        console.log(isCreditCardCodeValid, isCreditCardNumberValid);
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
    isPasswordValid &&
    isRepeatPasswordValid
  ) {
    if (isPaymentMethodCreditCard) {
      if (isCreditCardNumberValid && isCreditCardCodeValid) {
        isFormValid = true; // El formulario es válido si todos los campos son correctos
      }
    } else {
      isFormValid = true; // Si no es tarjeta de crédito, el formulario es válido
    }
  }
  console.log(isFormValid);

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
