const formulario = document.querySelector(".login__form");

const inputEmail = formulario.querySelector("#email");
const inputPassword = formulario.querySelector("#password");
const buttonLogin = formulario.querySelector("#js-button-login");



function inhabilitarBoton(){
    //trim elimina los espacios en blanco antes y despues del texto
    const emailCompleto = inputEmail.value.trim() != "";
    const passwordCompleto = inputPassword.value.trim() != "";
    const emailVerificado = verificarEmail(inputEmail.value.trim());

    if(emailCompleto == false || emailVerificado == false || passwordCompleto == false ){
        buttonLogin.disabled = true;
    }
    else{
        buttonLogin.disabled = false;
    }

    // console.log("mail: ", inputEmail.value, "password ", inputPassword.value);
}

function verificarEmail(emailCompleto){

    if(emailCompleto.includes("@") && emailCompleto.includes("\.")){
        return true;
    }
    return false;
}

inhabilitarBoton();
inputEmail.addEventListener("input", inhabilitarBoton);
inputPassword.addEventListener("input", inhabilitarBoton);


