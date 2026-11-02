// Cada usuario tiene su propia clave en localStorage
const clave = (usuario) => `progreso_${usuario}`;

// Devuelve todo el progreso del usuario: { "Inglés-4-1": 100, "Inglés-4-2": 60 }
function obtenerProgreso(usuario) {
  try {
    const guardado = localStorage.getItem(clave(usuario));
    return guardado ? JSON.parse(guardado) : {};
  } catch {
    return {}; // si el dato está corrupto, empieza de cero
  }
}
// Guarda el porcentaje (0 a 100) de una lección
function guardarLeccion(usuario, idLex, porcentaje) {
  const progreso = obtenerProgreso(usuario);
  progreso[idLex] = porcentaje;
  localStorage.setItem(clave(usuario), JSON.stringify(progreso));
}

// Porcentaje de una lección (0 si nunca se hizo)
function porcentajeLeccion(usuario, idLex) {
  return obtenerProgreso(usuario)[idLex] ?? 0;
}

// Una unidad está completada si todas sus lecciones están al 100%
// "lecciones" es la lista de objetos { idLec, titulo }
function unidadCompletada(usuario, lecciones) {
  return lecciones.every((l) => porcentajeLeccion(usuario, l.idLex) === 100);
}

// Reinicia una lección (para repetirla)
function reiniciarLeccion(usuario, idLex) {
  guardarLeccion(usuario, idLex, 0);
}

// Reinicia todas las lecciones de una unidad
function reiniciarUnidad(usuario, lecciones) {
  lecciones.forEach((l) => reiniciarLeccion(usuario, l.idLex));
}