function obtenerProgreso(usuario) {
    return usuario.progreso.lecciones;
}

function guardarLeccion(usuario, idLex, porcentaje) {
    usuario.progreso.lecciones[idLex] = porcentaje;
    guardarUsuario(usuario);
}

function porcentajeLeccion(usuario, idLex) {
    return obtenerProgreso(usuario)[idLex] ?? 0;
}

function unidadCompletada(usuario, lecciones) {
    return lecciones.every(
        l => porcentajeLeccion(usuario, l.idLex) === 100
    );
}

function reiniciarLeccion(usuario, idLex) {
    guardarLeccion(usuario, idLex, 0);
}

function reiniciarUnidad(usuario, lecciones) {
    lecciones.forEach(l => reiniciarLeccion(usuario, l.idLex));
}