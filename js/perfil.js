const user = JSON.parse(sessionStorage.getItem("user"));

function loadProfile() {
  const username = document.getElementById("js-username");
  const email = document.getElementById("js-email");

  username.textContent = user.nickName || "Usuario no encontrado";
  email.textContent = user.email || "Email no encontrado";
}

loadProfile();
