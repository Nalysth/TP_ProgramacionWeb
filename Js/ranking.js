//LIGAS
const LIGAS = [
  { clave: "bronce", nombre: "Liga de Bronce", medalla: "🥉", minimo: 0,   maximo: 99,       destino: "Liga de Plata" },
  { clave: "plata",  nombre: "Liga de Plata",  medalla: "🥈", minimo: 100, maximo: 299,      destino: "Liga de Oro" },
  { clave: "oro",    nombre: "Liga de Oro",    medalla: "🥇", minimo: 300, maximo: Infinity, destino: "Liga de Diamante" }
];

const FOTO = "../img/foto_avatar";
const MEDALLAS = ["🥇", "🥈", "🥉"];
const CLASES_FILA = [
  "segunda_fila_tabla_clasificacion",
  "tercera_fila_tabla_clasificacion",
  "cuarta_fila_tabla_clasificacion"
];

//METODOS USUARIOS

function obtenerPuntos(usuario) {
  return usuario.progreso?.puntos ?? 0;
}

function obtenerLigaPorPuntos(puntos) {
  return LIGAS.find(liga => puntos >= liga.minimo && puntos <= liga.maximo);
}

function crearCelda(contenido) {
  const celda = document.createElement("td");
  celda.className = "celda";
  if (typeof contenido === "string") {
    celda.textContent = contenido;
  } else {
    celda.appendChild(contenido);
  }
  return celda;
}

function crearCeldaEstudiante (usuario, esActivo) {
  const contenedor = document.createElement("div");
  contenedor.className = "celda-estudiante";

  const img = document.createElement("img");
  img.src = usuario.avatar || FOTO;
  img.alt = "Foto de " + usuario.nombre;
  img.className = "avatar-estudiante";

  const nombre = document.createElement("span");
  nombre.textContent = usuario.nombre + (esActivo ? " (Tú)" : "");

  contenedor.appendChild(img);
  contenedor.appendChild(nombre);
  return crearCelda(contenedor);
}

function crearFila(usuario, indice, esActivo) {
  const fila = document.createElement("tr");
  fila.className = esActivo
    ? "segunda_fila_tabla_clasificacion_plata"
    : CLASES_FILA[Math.min(indice, 2)];

  const puesto = (MEDALLAS[indice] || "") + (indice + 1);
  const estado = indice < 3 ? "Zona de Ascenso" : "Zona de Descenso";

  fila.appendChild(crearCelda(puesto));
  fila.appendChild(crearCeldaEstudiante(usuario, esActivo));
  fila.appendChild(crearCelda(obtenerPuntos(usuario) + " XP"));
  fila.appendChild(crearCelda(estado));
  return fila;
}

//CATEGORIA TABLA

function categoriaTabla(indiceLiga) {
  const liga = LIGAS[indiceLiga];

  document.getElementById("titulo-liga").textContent =
    " 🏆 Tabla de Clasificación - " + liga.nombre + " " + liga.medalla;
  document.getElementById("descripcion-liga").textContent =
    "Los 3 primeros ascienden a la " + liga.destino + " esta semana";

  const anterior = document.getElementById("flecha-anterior");
  const siguiente = document.getElementById("flecha-siguiente");

  if (indiceLiga > 0) {
    anterior.href = "?liga=" + LIGAS[indiceLiga - 1].clave;
    anterior.style.display = "";
  } else {
    anterior.style.display = "none";
  }

  if (indiceLiga < LIGAS.length - 1) {
    siguiente.href = "?liga=" + LIGAS[indiceLiga + 1].clave;
    siguiente.style.display = "";
  } else {
    siguiente.style.display = "none";
  }
}

//RANKING

function mostrarRanking() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const emailActivo = localStorage.getItem("usuarioActivo");
  const usuarioActivo = usuarios.find(u => u.email === emailActivo);

  // 1) ¿Qué liga mostrar? La de la URL; si no hay, la del usuario activo; si no, bronce.
  let clave = new URLSearchParams(window.location.search).get("liga");
  if (!LIGAS.some(liga => liga.clave === clave)) {
    clave = usuarioActivo
      ? obtenerLigaPorPuntos(obtenerPuntos(usuarioActivo)).clave
      : "bronce";
  }
  const indiceLiga = LIGAS.findIndex(liga => liga.clave === clave);

  const usuariosDeLigaActual = usuarios
    .filter(u => obtenerLigaPorPuntos(obtenerPuntos(u)) === LIGAS[indiceLiga])
    .sort((a, b) => obtenerPuntos(b) - obtenerPuntos(a));

  // 3) Dibujar
  categoriaTabla(indiceLiga);

  const cuerpo = document.getElementById("cuerpo-tabla");
  cuerpo.innerHTML = "";

  if (usuariosDeLigaActual.length === 0) {
    const fila = document.createElement("tr");
    const celda = crearCelda("Todavía no hay estudiantes en esta liga");
    celda.colSpan = 4;
    fila.appendChild(celda);
    cuerpo.appendChild(fila);
    return;
  }

  usuariosDeLigaActual.forEach((usuario, indice) => {
    const esActivo = usuarioActivo && usuario.id === usuarioActivo.id;
    cuerpo.appendChild(crearFila(usuario, indice, esActivo));
  });
}

mostrarRanking();