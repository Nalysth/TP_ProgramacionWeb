const params = new URLSearchParams(window.location.search);
const idiomaUrl = params.get("idioma");
const unidadId = params.get("unidad");

// Ajustá esta ruta a tu página de lección
const PAGINA_LECCION = "../Leccion interactiva/leccion.html";

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
  return (
    Object.keys(cursos).find((c) => normalizarTexto(c).startsWith(buscado)) ?? null
  );
}

async function mostrarLecciones() {
  const respuesta = await fetch("../IndiceUnidades/ListaUnidades.json");
  const cursos = await respuesta.json();

  // Clave exacta del JSON (por ejemplo "Ingles"), venga como venga en la URL
  const idioma = buscarIdioma(cursos, idiomaUrl);
  const curso = cursos[idioma];
  const unidad = curso?.unidades.find((u) => u.id == unidadId);
  const lista = document.getElementById("lista-lecciones");

  if (!unidad) {
    lista.textContent = "Unidad no encontrada";
    return;
  }

const usuario = obtenerUsuarioActivo();

const botonIndice = document.getElementById("btn-indice");

if (botonIndice) {
    botonIndice.href =
        `../IndiceUnidades/indiceUnidades.html?idioma=${encodeURIComponent(idioma)}`;
}

document.getElementById("titulo").textContent =
    `${curso.nombre.toUpperCase()} - UNIDAD ${unidad.id}`;
document.getElementById("subtitulo").textContent =
    unidad.descripcion.toUpperCase();

const stats = obtenerStats(usuario);

document.getElementById("puntos").textContent = stats.puntos;
document.getElementById("racha").textContent = stats.racha;

  console.log("Idioma detectado:", idioma);
  console.log("Enlace del índice:", botonIndice.href);

  // Normaliza: acepta lecciones como texto o como objeto { idLex, titulo }
  const lecciones = unidad.lecciones.map((l, i) => ({
    idLex: typeof l === "string" ? `${idioma}-${unidad.id}-${i + 1}` : l.idLex,
    titulo: typeof l === "string" ? l : l.titulo,
  }));

  const indiceActual = lecciones.findIndex((l) => {
    const porcentaje = porcentajeLeccion(usuario, l.idLex);
    return porcentaje > 0 && porcentaje < 100;
  });
  const indiceDestacado = indiceActual === -1 ? 0 : indiceActual;

  lista.innerHTML = lecciones.map((l, i) => {
    const porcentaje = porcentajeLeccion(usuario, l.idLex);
    let icono, colorIcono, estadoTexto, estadoClase, botonClase, botonTexto;

    if (porcentaje === 100) {
      icono = "fa-circle-check";
      estadoTexto = "COMPLETADA";
      colorIcono = "#51de6d";
      estadoClase = "estado_completada";
      botonClase = "boton_iniciarnt";
      botonTexto = "repetir";
    } else if (porcentaje > 0) {
      icono = "fa-clock";
      estadoTexto = "EN CURSO";
      colorIcono = "#E6A23C";
      estadoClase = "estado_en_curso";
      botonClase = "boton_iniciar";
      botonTexto = "continuar";
    } else {
      icono = "fa-lock";
      estadoTexto = "NO INICIADA";
      colorIcono = "#D9534F";
      estadoClase = "estado_no_iniciada";
      botonClase = "boton_iniciar";
      botonTexto = "iniciar";
    }

    const href = `${PAGINA_LECCION}?idioma=${encodeURIComponent(idioma)}` +
                 `&unidad=${unidad.id}&idLex=${encodeURIComponent(l.idLex)}`;

    return `
      <article class="targeta ${i === indiceDestacado ? "leccion-actual" : ""}">
        <p class="leccion">LECCION ${i + 1}</p>
        <section class="sector_emoji">
          <i class="fa-solid ${icono}" style="color: ${colorIcono};"></i>
        </section>
        <section class="texto_nombre_estado">
          <p class="nombreleccion">${l.titulo}</p>
          <p class="${estadoClase}">${estadoTexto}</p>
        </section>
        <a href="${href}" class="${botonClase}">${botonTexto}</a>
      </article>`;
  }).join("");

  // Reiniciar la unidad: borra el progreso, resta los puntos y rompe la racha
  document.getElementById("btn-reset").onclick = () => {
    if (!confirm("¿Seguro? Vas a perder los puntos de esta unidad y tu racha.")) return;
    lecciones.forEach((l) => guardarLeccion(usuario, l.idLex, 0));
    quitarPuntosUnidad(usuario, lecciones.map((l) => l.idLex));
    mostrarLecciones();
  };

  // Botón "siguiente unidad"
  const botonSiguiente = document.getElementById("btn-siguiente");
  const posicion = curso.unidades.findIndex((u) => u.id == unidadId);
  const siguiente = curso.unidades[posicion + 1];

  if (siguiente) {
    botonSiguiente.style.display = "";
    botonSiguiente.onclick = () => {
      window.location.href =
        `unidad.html?idioma=${encodeURIComponent(idioma)}&unidad=${siguiente.id}`;
    };
  } else {
    botonSiguiente.style.display = "none"; // es la última unidad
  }
}

mostrarLecciones();