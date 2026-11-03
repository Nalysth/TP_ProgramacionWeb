const PUNTOS_BASE = 2;

function obtenerStats(usuario) {
    return usuario.progreso;
}

function guardarStats(usuario, stats) {
    usuario.progreso.puntos = stats.puntos;
    usuario.progreso.racha = stats.racha;
    usuario.progreso.mejorRacha = stats.mejorRacha;
    usuario.progreso.ganadas = stats.ganadas;

    guardarUsuario(usuario);
}

function multiplicador(racha) {
    if (racha >= 10) return 3;
    if (racha >= 5) return 2;
    if (racha >= 3) return 1.5;
    return 1;
}

function completarLeccion(usuario, idLec, porcentaje) {
    guardarLeccion(usuario, idLec, porcentaje);

    const stats = obtenerStats(usuario);
    const esRepeticion = stats.ganadas[idLec] !== undefined;

    if (porcentaje < 100 || esRepeticion) {
        stats.racha = 0;
        guardarStats(usuario, stats);

        return {
            puntosGanados: 0,
            racha: 0,
            multiplicador: 1
        };
    }

    stats.racha += 1;
    stats.mejorRacha = Math.max(stats.mejorRacha, stats.racha);

    const mult = multiplicador(stats.racha);
    const puntosGanados = PUNTOS_BASE * mult;

    stats.puntos += puntosGanados;
    stats.ganadas[idLec] = puntosGanados;

    guardarStats(usuario, stats);

    return {
        puntosGanados,
        racha: stats.racha,
        multiplicador: mult
    };
}

function romperRacha(usuario) {
    const stats = obtenerStats(usuario);

    stats.racha = 0;

    guardarStats(usuario, stats);
}

function quitarPuntosUnidad(usuario, idLexs) {
    const stats = obtenerStats(usuario);
    let restados = 0;

    idLexs.forEach(id => {
        if (stats.ganadas[id] !== undefined) {
            restados += stats.ganadas[id];
            delete stats.ganadas[id];
        }
    });

    stats.puntos = Math.max(0, stats.puntos - restados);
    stats.racha = 0;

    guardarStats(usuario, stats);

    return restados;
}