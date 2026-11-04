// Inicio el header y el foooter:
cargarHeaderYFooterConDatos('/footers-y-headers/headerCompleto.html', '/footers-y-headers/footerSinRedes.html');

// Traigo todos los datos necesarios:
const nickGrande = document.querySelector('.text_nombre')
const maximaCantidadXP = document.getElementById('stat_max_xp');
const mejorRacha = document.getElementById('mejor_racha');

const email = document.getElementById("emailDato")
const telefono = document.getElementById("telDato")
const contraseña = document.getElementById("contraseñaDato")
const nick = document.getElementById("nickDato")

const usuarioActual = obtenerUsuarioActivo();

// Establesco los datos a partir del localStorage:
nickGrande.textContent = usuarioActual.usuario.toUpperCase();
maximaCantidadXP.textContent = usuarioActual.progreso.puntos;
mejorRacha.textContent = usuarioActual.progreso.mejorRacha;

email.textContent = usuarioActual.email;
telefono.textContent = usuarioActual.telefono;
nick.textContent = usuarioActual.usuario;

// Eliminar usuario actual:
const btnEliminar = document.getElementById('boton_eliminar');

btnEliminar.addEventListener('click', () =>{
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const emailActivo = localStorage.getItem("usuarioActivo");

const indice = usuarios.findIndex(u => u.email === emailActivo);

if (indice !== -1) {
    usuarios.splice(indice, 1);   // borra 1 elemento en esa posición
}

localStorage.setItem("usuarios", JSON.stringify(usuarios));
localStorage.removeItem("usuarioActivo");

window.location.href = "/index.html";
})
