const params = new URLSearchParams(window.location.search);
const idioma = params.get("idioma");

document.getElementById("titulo").textContent = `Índice: ${idioma}`;

async function mostrarUnidades() {
  const respuesta = await fetch("../IndiceUnidades/ListaUnidades.json");
  const cursos = await respuesta.json();

  const curso = cursos[idioma];
  const lista = document.getElementById("lista-unidades");

  lista.innerHTML = curso.unidades.map((u) => `
    <button class="contenedorUnidad" data-id="${u.id}">
      <span class="nombreUnidad">Unidad ${u.id}: ${u.titulo}</span>
    </button>
  `).join("");
}

mostrarUnidades();