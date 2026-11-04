
const usuarios = [
    {
        id: 1,
        nombre: "Juan",
        email: "juan@gmail.com",
        password: "1234",
        progreso: {
            lecciones: {},
            puntos: 0,
            racha: 0,
            mejorRacha: 0,
            ganadas: {}
        }
    },
    {
        id: 2,
        nombre: "María",
        email: "maria@gmail.com",
        password: "1234",
        progreso: {
            lecciones: {},
            puntos: 0,
            racha: 0,
            mejorRacha: 0,
            ganadas: {}
        }
    }
];

if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function obtenerUsuarioActivo() {
    const email = localStorage.getItem("usuarioActivo");

    if (!email) {
        window.location.href = "../index.html";
        return null;
    }

    const usuariosGuardados =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuariosGuardados.find(
        usuario => usuario.email === email
    );

    if (!usuario) {
        window.location.href = "../index.html";
        return null;
    }

    if (!usuario.progreso) {
        usuario.progreso = {};
    }

    usuario.progreso.lecciones ??= {};
    usuario.progreso.puntos ??= 0;
    usuario.progreso.racha ??= 0;
    usuario.progreso.mejorRacha ??= 0;
    usuario.progreso.ganadas ??= {};

    guardarUsuario(usuario);

    return usuario;
}

function guardarUsuario(usuario) {
    const usuariosGuardados =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const indice = usuariosGuardados.findIndex(
        u => u.id === usuario.id
    );

    if (indice !== -1) {
        usuariosGuardados[indice] = usuario;
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosGuardados)
        );
    }
}
