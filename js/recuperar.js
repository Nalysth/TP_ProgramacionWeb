
const email = document.getElementById("email");
const form = document.getElementById("form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e) {
    e.preventDefault();
    mensaje.textContent = "";

    if (email.value === "") {
        mensaje.textContent = "Ingresá tu correo electrónico.";
        return;
    }

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));

    const usuarioEncontrado = listaUsuarios.find(
        usuario => usuario.email === email.value
    );

    if (usuarioEncontrado) {
        mensaje.textContent = "Se enviará un código de verificación a tu correo electrónico.";
    } else {
        mensaje.textContent = "No encontramos una cuenta asociada a ese correo electrónico.";
    }
});
