const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user);

function loadProfile() {
  const username = document.getElementById("js-username");
  const email = document.getElementById("js-email");
  const inputsRadio = document.querySelectorAll(".js-payment");
  const creditCardInput = document.getElementById("js-creditCard");
  const creditCardCodeInput = document.getElementById("js-creditCardCode");
  const rapiPagoInput = document.getElementById("js-rapiPago");
  const pagoFacilInput = document.getElementById("js-pagoFacil");
  const passwordInput = document.getElementById("js-password");
  const repeatPasswordInput = document.getElementById("js-repeatPassword");
  const saveButton = document.getElementById("js-save-button");
  const logoutButton = document.getElementById("js-logout-button");
  const cancelSubscriptionButton = document.getElementById(
    "js-cancel-subscription-button"
  );

  username.textContent = user.nickName || "Usuario no encontrado";
  email.textContent = user.email || "Email no encontrado";

  inputsRadio.forEach((input) => {
    if (input.value === user.paymentMethod) {
      input.checked = true;

      if (user.paymentMethod === "tarjetaCredito") {
        creditCardInput.value = user.creditCard || "";
        creditCardCodeInput.value = user.creditCardCode || "";
        rapiPagoInput.disabled = true;
        pagoFacilInput.disabled = true;
      }

      if (user.paymentMethod === "cuponPago") {
        rapiPagoInput.checked = user.rapiPago || "";
        pagoFacilInput.checked = user.pagoFacil || "";
        creditCardInput.disabled = true;
        creditCardCodeInput.disabled = true;
      }

      if (user.paymentMethod === "transferencia") {
        rapiPagoInput.disabled = true;
        pagoFacilInput.disabled = true;
        creditCardInput.disabled = true;
        creditCardCodeInput.disabled = true;
      }
    }

    input.addEventListener("change", validateForm);
  });

  creditCardInput.addEventListener("input", validateForm);
  creditCardCodeInput.addEventListener("input", validateForm);
  passwordInput.addEventListener("input", validateForm);
  repeatPasswordInput.addEventListener("input", validateForm);

  saveButton.addEventListener("click", sendChanges);
  logoutButton.addEventListener("click", endSession);
  cancelSubscriptionButton.addEventListener("click", cancelSubscription);

  function validateForm() {
    let isFormValid = false;

    const regexCreditCardCode = /^[1-9]{3}$/; // Regex para validar código de tarjeta (3 dígitos del 1 al 9)
    const regexCreditCard = /^\d{16}$/; // Regex para validar número de tarjeta (16 dígitos numéricos)

    const isPasswordValid = validarPassword(passwordInput.value);
    const isCreditCardNumberValid = validateCreditCard(
      creditCardInput.value,
      regexCreditCard
    );
    const isCreditCardCodeValid = regexCreditCardCode.test(
      creditCardCodeInput.value
    );

    inputsRadio.forEach((input) => {
      if (input.checked) {
        if (input.value === "tarjetaCredito") {
          rapiPagoInput.disabled = true;
          pagoFacilInput.disabled = true;
          creditCardInput.disabled = false;
          creditCardCodeInput.disabled = false;
        }

        if (input.value === "cuponPago") {
          creditCardInput.disabled = true;
          creditCardCodeInput.disabled = true;
          rapiPagoInput.disabled = false;
          pagoFacilInput.disabled = false;
        }

        if (input.value === "transferencia") {
          creditCardInput.disabled = true;
          creditCardCodeInput.disabled = true;
          rapiPagoInput.disabled = true;
          pagoFacilInput.disabled = true;
        }
      }
    });

    if (isPasswordValid && passwordInput.value === repeatPasswordInput.value) {
      // Tarjeta de crédito seleccionada y datos válidos
      if (
        inputsRadio[0].checked &&
        isCreditCardNumberValid &&
        isCreditCardCodeValid
      )
        isFormValid = true;

      // RapiPago o PagoFácil seleccionados
      if (inputsRadio[1].checked || inputsRadio[2].checked) isFormValid = true;
    }

    saveButton.disabled = !isFormValid;
  }

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

  function sendChanges() {
    user.password = passwordInput.value;

    if (inputsRadio[0].checked) {
      user.paymentMethod = "tarjetaCredito";
      user.creditCard = creditCardInput.value;
      user.creditCardCode = creditCardCodeInput.value;
      user.rapiPago = null;
      user.pagoFacil = null;
    }

    if (inputsRadio[1].checked) {
      user.paymentMethod = "cuponPago";
      user.rapiPago = rapiPagoInput.checked;
      user.pagoFacil = pagoFacilInput.checked;
    }

    if (inputsRadio[2].checked) {
      user.paymentMethod = "transferencia";
      user.rapiPago = null;
      user.pagoFacil = null;
    }

    // Guardar los cambios en el localStorage
    localStorage.setItem(user.email, JSON.stringify(user));
    sessionStorage.setItem("user", JSON.stringify(user));
    alert("Cambios guardados exitosamente");
    window.location.href = "/pages/home.html"; // Redirigir a la página de inicio
  }

  function endSession() {
    sessionStorage.removeItem("user");
    alert("Sesión cerrada exitosamente");
    window.location.href = "/index.html";
  }

  function cancelSubscription() {
    if (confirm("¿Estás seguro de que deseas cancelar tu suscripción?")) {
      // Eliminar el usuario del localStorage
      localStorage.removeItem(user.email);
      sessionStorage.removeItem("user");
      alert("Suscripción cancelada exitosamente");
      window.location.href = "/index.html"; // Redirigir a la página de inicio
    }
  }
}

loadProfile();
