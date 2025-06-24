const user = JSON.parse(sessionStorage.getItem("user")); // Obtenemos el usuario del session storage

/*---------------------- EDITAR EL PERFIL ---------------------- */
function editProfile() {
  /* Traemos los inputs del HTML por ID */
  const username = document.getElementById("js-username");
  const email = document.getElementById("js-email");
  const inputsRadio = document.querySelectorAll(".js-payment"); // guardaremos un array de inputs tipo radio (métodos de pago)
  const creditCardInput = document.getElementById("js-creditCard");
  const creditCardCodeInput = document.getElementById("js-creditCardCode");
  const rapiPagoInput = document.getElementById("js-rapiPago"); //input tipo radio
  const pagoFacilInput = document.getElementById("js-pagoFacil"); //input tipo radio
  const passwordInput = document.getElementById("js-password");
  const repeatPasswordInput = document.getElementById("js-repeatPassword");

  /* Traemos los botones del HTML por id */
  const saveButton = document.getElementById("js-save-button");
  const logoutButton = document.getElementById("js-logout-button");
  const cancelSubscriptionButton = document.getElementById(
    "js-cancel-subscription-button"
  );

  /* Traemos los span de errores del HTML por id */
  const errorPassword = document.getElementById("error-password");
  const errorRepeatPassword = document.getElementById("error-repeatPassword");
  const errorCreditCard = document.getElementById("error-creditCard");
  const errorCreditCardCode = document.getElementById("error-creditCardCode");

  /* Mostramos el nombre de usuario y email de forma dinámica */
  /* acá decimos que si existe user.nickName que lo muestre si no muestra usuario no encontrado. La evaluación de la expresión se detiene tan pronto como se puede determinar el resultado final con || o && */
  username.textContent = user.nickName || "Usuario no encontrado";
  email.textContent = user.email || "Email no encontrado";

  /* Recorremos el array de inputs tipo radio (son 3 elementos) para cargar los datos guardados en session storage 
  Recordar:
  Posición [0] nos da el input de tarjeta de crédito
  Posición [1] nos da el input de cupon de pago
  Posición [2] nos da el input de transferencia
  */
  inputsRadio.forEach((input) => {
    /* Si es igual al metodo de pago que se encuentra en session storage marcamos el radio del input*/
    if (input.value === user.paymentMethod) {
      input.checked = true; // lo marcamos

      /* Si el usuario eligió tarjeta de crédito como metodo de pago se cargan los datos de la tarjeta */
      if (user.paymentMethod === "tarjetaCredito") {
        creditCardInput.value = user.creditCard || "";
        creditCardCodeInput.value = user.creditCardCode || "";
        rapiPagoInput.disabled = true; // deshabilitamos los demas inputs
        pagoFacilInput.disabled = true;
      }

      /* si el usuario eligió cupon de pago marcamos la opción que eligió cuando se registro con los datos de sessión storage */
      if (user.paymentMethod === "cuponPago") {
        rapiPagoInput.checked = user.rapiPago || false;
        pagoFacilInput.checked = user.pagoFacil || false;
        creditCardInput.disabled = true; // deshabilitamos los inputs referidos a la tarjeta de crédito
        creditCardCodeInput.disabled = true;
      }

      /* Si es transferencia deshabilitamos los demas inputs */
      if (user.paymentMethod === "transferencia") {
        rapiPagoInput.disabled = true;
        pagoFacilInput.disabled = true;
        creditCardInput.disabled = true;
        creditCardCodeInput.disabled = true;
      }
    }

    input.addEventListener("change", validateForm); // evento que detecta cada cambio en estos inputs del array y ejecuta la función validateForm
  });

  /* Eventos de input para validar datos */
  creditCardInput.addEventListener("input", validateForm);
  creditCardCodeInput.addEventListener("input", validateForm);
  passwordInput.addEventListener("input", validateForm);
  repeatPasswordInput.addEventListener("input", validateForm);

  /* Eventos de los botones para ejecutar acciones */
  saveButton.addEventListener("click", sendChanges);
  logoutButton.addEventListener("click", endSession);
  cancelSubscriptionButton.addEventListener("click", cancelSubscription);

  /* Función para validar el formulario */
  function validateForm() {
    let isFormValid = false; // con esta variable se habilita o deshabilita el botón por medio de la propiedad disable

    const regexCreditCardCode = /^[1-9]{3}$/; // Regex para validar código de tarjeta (3 dígitos del 1 al 9)
    const regexCreditCard = /^\d{16}$/; // Regex para validar número de tarjeta (16 dígitos numéricos)

    /* Validamos las contraseñas y la tarjeta de crédito con funciones */
    const isPasswordValid = validarPassword(passwordInput.value);
    const isCreditCardNumberValid = validateCreditCard(
      creditCardInput.value,
      regexCreditCard
    );

    /* Testeamos el código de la tarjeta con regex */
    const isCreditCardCodeValid = regexCreditCardCode.test(
      creditCardCodeInput.value
    );

    /* Vemos si se selecciono un método de pago y si es valido para habilitar en caso de que la contraseña este vacia */
    let isPaymentValid = false;

    /* Recorremos los inputs con un forEach y habilitamos o deshabilitamos según lo que esta seleccionado */
    inputsRadio.forEach((input) => {
      if (input.checked) {
        if (input.value === "tarjetaCredito") {
          rapiPagoInput.disabled = true;
          pagoFacilInput.disabled = true;
          creditCardInput.disabled = false;
          creditCardCodeInput.disabled = false;
          isPaymentValid = isCreditCardNumberValid && isCreditCardCodeValid; // devuelve true si los dos son true sino false
        }

        if (input.value === "cuponPago") {
          creditCardInput.disabled = true;
          creditCardCodeInput.disabled = true;
          rapiPagoInput.disabled = false;
          pagoFacilInput.disabled = false;
          isPaymentValid = true;
        }

        if (input.value === "transferencia") {
          creditCardInput.disabled = true;
          creditCardCodeInput.disabled = true;
          rapiPagoInput.disabled = true;
          pagoFacilInput.disabled = true;
          isPaymentValid = true;
        }
      }
    });

    /*----------- SPAN PARA MOSTRAR  ERRORES ----------- */

    /* Inicialmente no dirán nada pero si hay error insertamos una cadena de texto con el mensaje correspondiente */
    errorPassword.textContent = "";
    errorRepeatPassword.textContent = "";
    errorCreditCard.textContent = "";
    errorCreditCardCode.textContent = "";

    if (!isPasswordValid)
      errorPassword.textContent =
        "La contraseña debe tener 8 caracteres con mínimo 2 letras, 2 números y 2 especiales.";

    if (passwordInput.value !== repeatPasswordInput.value)
      errorRepeatPassword.textContent = "Las contraseñas no coinciden.";

    if (!isCreditCardCodeValid && inputsRadio[0].checked)
      errorCreditCardCode.textContent =
        "Código inválido. Deben ser 3 dígitos del 1 al 9.";

    if (!isCreditCardNumberValid && inputsRadio[0].checked)
      errorCreditCard.textContent = "Número de tarjeta inválido.";

    /*----------- SPAN ERRORES ----------- */

    /* CONDICIONES PARA QUE ISFORMVALID SEA TRUE O SIGA SIENDO FALSE */

    /* Contraseña valida y contraseña debe coincidir con la contraseña repetida */
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

    /* Activamos o desactivamos el botón según las validaciones */
    saveButton.disabled = !isFormValid;
  }

  /*---------------------- VALIDAR LA CONTRASEÑA ---------------------- */
  function validarPassword(password) {
    if (password === "") return true; // si esta vacio esta bien por que el usuario no esta obligado a cambiar la contraseña
    if (password.length != 8) return false; // Validar longitud de 8 caracteres

    let letras = 0; // Contador de letras
    let numeros = 0; // Contador de números
    let especiales = 0; // Contador de caracteres especiales

    // Contar letras, números y caracteres especiales
    // Recorre cada valor del iterable (ej: cada input, carácter, etc.) FOR OF
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

  /*---------------------- VALIDAR EL NÚMERO DE TARJETA ---------------------- */
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

  /*----------------------  ACTUALIZAR PERFIL ---------------------- */
  function sendChanges() {
    if (passwordInput.value != "") user.password = passwordInput.value; // efectuamos el cambio de contraseña

    /* Si es tarjeta de crédito efectuamos los cambios correspondientes */
    if (inputsRadio[0].checked) {
      user.paymentMethod = "tarjetaCredito";
      user.creditCard = creditCardInput.value;
      user.creditCardCode = creditCardCodeInput.value;
      user.rapiPago = null;
      user.pagoFacil = null;
    }

    /* Si es cupon de pago efectuamos los cambios correspondientes */
    if (inputsRadio[1].checked) {
      user.paymentMethod = "cuponPago";
      user.rapiPago = rapiPagoInput.checked;
      user.pagoFacil = pagoFacilInput.checked;
    }

    /* Si es transferencia efectuamos los cambios correspondientes */
    if (inputsRadio[2].checked) {
      user.paymentMethod = "transferencia";
      user.rapiPago = null;
      user.pagoFacil = null;
    }

    // Guardar los cambios en el localStorage
    localStorage.setItem(user.email, JSON.stringify(user));
    sessionStorage.setItem("user", JSON.stringify(user));
    saveButton.textContent = "Cambios aplicados";
    setTimeout(() => {
      window.location.href = "/pages/home.html"; // Redirigir a la página de inicio
    }, 2500);
  }

  /*---------------------- CERRAR SESIÓN ---------------------- */
  function endSession() {
    sessionStorage.removeItem("user"); // removemos el usuario de session storage
    alert("Sesión cerrada exitosamente");
    window.location.href = "/index.html"; // navegamos al index.html para iniciar sesión
  }

  /*----------------------  CANCELAR SUBSCRIPCIÓN (ELIMINAR CUENTA) ---------------------- */
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

editProfile(); // Invocación de toda la funcionalidad
