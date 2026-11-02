const params = new URLSearchParams(window.location.search);
const idioma = params.get("idioma");
const unidadId = params.get("unidad");


// Ajustá esta ruta a tu página de lección
const PAGINA_LECCION = "../Leccion interactiva/leccion.html";

async function mostrarLecciones() {
  const respuesta = await fetch("../IndiceUnidades/ListaUnidades.json");
  const cursos = await respuesta.json();

  const curso = cursos[idioma];
  const unidad = curso?.unidades.find((u) => u.id == unidadId);
  const lista = document.getElementById("lista-lecciones");

  if (!unidad) {
    lista.textContent = "Unidad no encontrada";
    return;
  }

  const usuario = obtenerUsuarioActual();

  document.getElementById("titulo").textContent =
    `${curso.nombre.toUpperCase()} - UNIDAD ${unidad.id}`;
  document.getElementById("subtitulo").textContent =
    unidad.descripcion.toUpperCase();
  document.getElementById("btn-indice").href =
    `../IndiceUnidades/IndiceUnidades.html?idioma=${encodeURIComponent(idioma)}`;

  // Normaliza: acepta lecciones como texto o como objeto { idLec, titulo }
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
      icono = 'fa-circle-check'; 
      estadoTexto = "COMPLETADA";
      colorIcono ="#51de6d" 
      estadoClase = "estado_completada";
      botonClase = "boton_iniciarnt"; 
      botonTexto = "repetir";
    } else if (porcentaje > 0) {
      icono = 'fa-clock';
      estadoTexto = "EN CURSO"; 
      colorIcono ="#E6A23C" 
      estadoClase = "estado_en_curso";
      botonClase = "boton_iniciar"; 
      botonTexto = "continuar";
    } else {
      icono = 'fa-lock';
      estadoTexto = "NO INICIADA";
      colorIcono ="#D9534F"  
      estadoClase = "estado_no_iniciada";
      botonClase = "boton_iniciar"; 
      botonTexto = "iniciar";
    }
const href = `${PAGINA_LECCION}?idioma=${encodeURIComponent(idioma)}` +
             `&unidad=${unidad.id}&idLex=${encodeURIComponent(l.idLex)}`;

    return `
        <article class="targeta ${i === indiceDestacado ? 'leccion-actual' : ''}">
        <p class="leccion">LECCION ${i + 1}</p>
        <section class="sector_emoji">
          <i class="fa-solid ${icono}" style="color: ${colorIcono};"></i>
        </section>
        <section class="texto_nombre_estado">
          <p class= "nombreleccion">${l.titulo}</p>
          <p class="${estadoClase}">${estadoTexto}</p>
        </section>
        <a href="${href}" class="${botonClase}">${botonTexto}</a>      
        </article>`;
  }).join("");

  // Reiniciar todas las lecciones de la unidad
  document.getElementById("btn-reset").onclick = () => {
    if (!confirm("¿Seguro que querés empezar de nuevo esta unidad?")) return;
    lecciones.forEach((l) => guardarLeccion(usuario, l.idLex, 0));
    mostrarLecciones();
  };
}

mostrarLecciones();