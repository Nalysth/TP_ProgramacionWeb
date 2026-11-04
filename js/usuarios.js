const usuarios = [];

if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function obtenerUsuarioActivo() {
    const email = localStorage.getItem("usuarioActivo");

    if (!email) {
        window.location.href = "../index.html";
        return null;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));

    const usuario = usuarios.find(
        usuario => usuario.email === email
    );

    if (!usuario) {
        window.location.href = "../index.html";
        return null;
    }

    return usuario;
}