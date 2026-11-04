// Inicio el header y el foooter:
iniciarDatos('/footers-y-headers/headerCompleto.html' , '/footers-y-headers/footerSinRedes.html');

// Traigo todos los datos necesarios:
const email = document.getElementById("mailDato")
const telefono = document.getElementById("telDato")
const contraseña = document.getElementById("contraseñaDato")
const nick = document.getElementById("nickDato")
const nickGrande = document.querySelector('.text_nombre')

// Establesco los datos a partir del localStorage:
const usuarioActual = obtenerUsuarioActivo();

nickGrande.textContent = usuarioActual.usuario.toUpperCase();

email.textContent = usuarioActual.email;
telefono.textContent = usuarioActual.telefono;
nick.textContent = usuarioActual.usuario;