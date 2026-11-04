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
    // hace la mejor racha con la funcion
    stats.mejorRacha = Math.max(stats.mejorRacha, stats.racha);

    const mult = multiplicador(stats.racha);
    const puntosGanados = PUNTOS_BASE * mult;

    stats.puntos += puntosGanados;
    stats.ganadas[idLec] = puntosGanados;

    const hoy = fechaActualXP();

if (usuario.progreso.fechaXP !== hoy) {
    usuario.progreso.fechaXP = hoy;
    usuario.progreso.xpHoy = 0;
}

usuario.progreso.xpHoy += puntosGanados;

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

function fechaActualXP() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}