const params = new URLSearchParams(window.location.search);
const idioma = params.get("idioma");

document.getElementById("titulo").textContent = `Índice: ${idioma}`;


async function mostrarUnidades() {
  const respuesta = await fetch("../IndiceUnidades/ListaUnidades.json");
  const cursos = await respuesta.json();

  const idiomas = {
      "Inglés": "Inglés",
      "Alemán": "Alemán",
      "ChinoMandarin": "ChinoMandarin"
  };
  const curso = cursos[idiomas[idioma]]; 

  const lista = document.getElementById("lista-unidades");
  const usuario = obtenerUsuarioActivo();

  lista.innerHTML = curso.unidades.map((u) => {
    const porcentaje = calcularPorcentajeUnidad(usuario, u);

    return `
      <button class="contenedorUnidad" data-id="${u.id}">
        <span class="nombreUnidad">Unidad ${u.id}: <span class="tituloUnidad">${u.titulo}</span></span>
        <p class="descripcionUnidad">${u.descripcion}</p>
        <article class="barra-de-progreso">
            <div class="progreso-actual" style="width: ${porcentaje}%"></div>
            <p class="porcentaje-unidad">${porcentaje}% completado</p>
        </article>
      </button>
    `;
}).join("");
  lista.querySelectorAll(".contenedorUnidad").forEach((boton) => {
    boton.addEventListener("click", () => {
      window.location.href =
        `../TresLecciones/unidad.html?idioma=${encodeURIComponent(idioma)}&unidad=${boton.dataset.id}&origen=indice`;    
      });
  });
}
function calcularPorcentajeUnidad(usuario, unidad) {
    const totalLecciones = unidad.lecciones.length;

    if (totalLecciones === 0) return 0;

    const leccionesCompletadas = unidad.lecciones.filter(
        l => porcentajeLeccion(usuario, l.idLex) === 100
    ).length;

    return Math.round((leccionesCompletadas / totalLecciones) * 100);
}

mostrarUnidades();