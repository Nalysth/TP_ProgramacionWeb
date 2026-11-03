const PUNTOS_BASE = 2;
const claveStats = (usuario) => `stats_${usuario}`;

// { puntos, racha, mejorRacha, ganadas: { idLec: true } }
function obtenerStats(usuario) {
  try {
    const guardado = localStorage.getItem(claveStats(usuario));
    if (guardado) return JSON.parse(guardado);
  } catch {}
  return { puntos: 0, racha: 0, mejorRacha: 0, ganadas: {} };
}

function guardarStats(usuario, stats) {
  localStorage.setItem(claveStats(usuario), JSON.stringify(stats));
}

function multiplicador(racha) {
  if (racha >= 10) return 3;
  if (racha >= 5) return 2;
  if (racha >= 3) return 1.5;
  return 1;
}

// Llamala cuando el usuario TERMINA una lección
function completarLeccion(usuario, idLec, porcentaje) {
  guardarLeccion(usuario, idLec, porcentaje); // progreso (progreso.js)


  const stats = obtenerStats(usuario);
  const esRepeticion = stats.ganadas[idLec] !== undefined;
  // Perdió o repitió: se rompe la racha y no suma puntos
  if (porcentaje < 100 || esRepeticion) {
    stats.racha = 0;
    guardarStats(usuario, stats);
    return { puntosGanados: 0, racha: 0, multiplicador: 1 };
  }

  // Ganó una lección nueva
  stats.racha += 1;
  stats.mejorRacha = Math.max(stats.mejorRacha, stats.racha);
  const mult = multiplicador(stats.racha);
  const puntosGanados = PUNTOS_BASE * mult;

  stats.puntos += puntosGanados;
  stats.ganadas[idLec] = puntosGanados;  guardarStats(usuario, stats);

  return { puntosGanados, racha: stats.racha, multiplicador: mult };
}

// Llamala al reiniciar una unidad
function romperRacha(usuario) {
  const stats = obtenerStats(usuario);
  stats.racha = 0;
  guardarStats(usuario, stats);
}
// Llamala al reiniciar una unidad: resta los puntos de sus lecciones y rompe la racha
// idLexs = lista de ids de las lecciones de la unidad
function quitarPuntosUnidad(usuario, idLexs) {
  const stats = obtenerStats(usuario);
  let restados = 0;

  idLexs.forEach((id) => {
    if (stats.ganadas[id] !== undefined) {
      restados += typeof stats.ganadas[id] === "number" ? stats.ganadas[id] : PUNTOS_BASE;
      delete stats.ganadas[id];
    }
  });

  stats.puntos = Math.max(0, stats.puntos - restados);
  stats.racha = 0;
  guardarStats(usuario, stats);
  return restados;
}