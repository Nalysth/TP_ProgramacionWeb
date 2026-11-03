const PAGINA_UNIDAD = "../TresLecciones/unidad.html";
const RUTA_UNIDADES = "../IndiceUnidades/ListaUnidades.json";

// Ignora tildes, mayúsculas y espacios para encontrar la clave del JSON
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "");
}

function buscarIdioma(cursos, idiomaUrl) {
  if (!idiomaUrl) return null;
  const buscado = normalizarTexto(idiomaUrl);
  return Object.keys(cursos).find((clave) =>
    normalizarTexto(clave).startsWith(buscado)
  ) ?? null;
}

async function configurarContinuar() {
  const botones = document.querySelectorAll(".btn-continuar");
  if (botones.length === 0) return;

  const usuario = obtenerUsuarioActivo();
  const cursos = await fetch(RUTA_UNIDADES).then((r) => r.json());

  botones.forEach((boton) => {
    // El idioma viaja en el href del botón: ...?idioma=ingles
    const idiomaUrl = new URL(boton.href).searchParams.get("idioma");
    const idioma = buscarIdioma(cursos, idiomaUrl);

    if (!idioma) {
      console.error(`Idioma "${idiomaUrl}" no encontrado. Disponibles:`, Object.keys(cursos));
      return;
    }

    const unidades = cursos[idioma].unidades;

    // Estado de cada unidad según el progreso guardado
    const estado = unidades.map((u) => {
      const porcentajes = u.lecciones.map((l, i) => {
        const idLex = typeof l === "string" ? `${idioma}-${u.id}-${i + 1}` : l.idLex;
        return porcentajeLeccion(usuario, idLex);
      });

      const completada = porcentajes.every((p) => p === 100);
      const empezada = porcentajes.some((p) => p > 0);

      return { id: u.id, completada, enCurso: empezada && !completada };
    });

    // La en curso más alta; si no hay, la primera sin completar; si no, la primera
    const enCurso = estado.filter((e) => e.enCurso);
    const destino = enCurso.length > 0
      ? enCurso[enCurso.length - 1]
      : estado.find((e) => !e.completada) || estado[0];

    boton.href = `${PAGINA_UNIDAD}?idioma=${encodeURIComponent(idioma)}&unidad=${destino.id}`;
  });
}

configurarContinuar();