(function () {

const params = new URLSearchParams(window.location.search);

const idioma = params.get("idioma");
const unidadId = params.get("unidad");
const idLex = params.get("idLex");

const RUTA_CONTENIDO = "../Leccion interactiva/ListaLecciones.json";
const RUTA_UNIDADES = "../IndiceUnidades/ListaUnidades.json";
const RUTA_RESPUESTAS = "../Leccion interactiva/RespuestasCorrectas.json";
const RUTA_DISTRACTORES = "../Leccion interactiva/distractores.json";

const elXpHoy = document.getElementById('xpHoy');
const elRachaActual = document.getElementById('rachaActual');


const TIEMPO_INICIAL = 90;

const usuario = obtenerUsuarioActivo();

if (elRachaActual) elRachaActual.textContent = usuario.progreso.racha ?? 0;
if (elXpHoy) elXpHoy.textContent = usuario.progreso.puntos ?? 0;


let tiempoRestante = TIEMPO_INICIAL;
let temporizador = null;

let palabrasSeleccionadas = [];
let bancoPalabras = [];

let respuestaCorrecta = "";
let finalizada = false;
let datosUnidades;
let distractores;

// Elementos del HTML
const tituloLeccion = document.getElementById("titulo-leccion");
const textoTraducir = document.getElementById("texto-traducir");

const banco = document.getElementById("banco-palabras");
const respuestaUsuario = document.getElementById("respuesta-usuario");

const barraProgreso = document.getElementById("barra-progreso");
const textoProgreso = document.getElementById("texto-progreso");

const tiempoHTML = document.getElementById("tiempo-restante");

const modal = document.getElementById("modal-respuesta");
const mensajeModal = document.getElementById("mensaje-modal");

const botonEnviar = document.getElementById("btn-enviar");
const botonAbandonar = document.getElementById("btn-arrepentirse");
const botonCerrarModal = document.getElementById("btn-cerrar-modal");

const claveTiempo = `tiempo_${usuario.id}_${idLex}`;

function normalizar(texto) {
    return texto
        .toLowerCase()
        .trim()
        .replace(/[.,!?¿¡;:]/g, "")
        .replace(/\s+/g, " ");
}

async function cargarLeccion() {

    try {
        const [respuestaContenido, respuestaUnidades, respuestaRespuestas, respuestaDistractores] =
            await Promise.all([
                fetch(RUTA_CONTENIDO),
                fetch(RUTA_UNIDADES),
                fetch(RUTA_RESPUESTAS),
                fetch(RUTA_DISTRACTORES)
            ]);

        if (!respuestaContenido.ok) {
            throw new Error("No se pudo cargar ContenidoLecciones.json");
        }

        if (!respuestaDistractores.ok) {
            throw new Error("No se pudo cargar distractores.json");
        }

        if (!respuestaUnidades.ok) {
            throw new Error("No se pudo cargar ListaUnidades.json");
        }

        if (!respuestaRespuestas.ok) {
            throw new Error("No se pudo cargar respuestasCorrectas.json");
        }

        distractores = await respuestaDistractores.json();
        const contenidos = await respuestaContenido.json();
        datosUnidades = await respuestaUnidades.json();
        const respuestas = await respuestaRespuestas.json();

        const curso = datosUnidades[idioma];

        if (!curso) {
            throw new Error("No se encontró el idioma: " + idioma);
        }

        const unidad = curso.unidades.find(
            u => u.id === Number(unidadId)
        );

        if (!unidad) {
            throw new Error("No se encontró la unidad.");
        }

        const leccion = unidad.lecciones.find(
            l => l.idLex === idLex
        );

        const datosLeccion = contenidos[idLex];

        if (!leccion || !datosLeccion || !respuestas[idLex]) {
            throw new Error("No se encontró la información de la lección.");
        }

        const numeroLeccion = unidad.lecciones.findIndex(
            l => l.idLex === idLex
        ) + 1;

        tituloLeccion.textContent = `${unidad.titulo} - Lección ${numeroLeccion}`;
        textoTraducir.textContent = datosLeccion.textoTraducir;

        bancoPalabras = [
            ...datosLeccion.bancoPalabras,
            ...(distractores[idLex] || [])
        ];

        bancoPalabras.sort(() => Math.random() - 0.5); 
               
        respuestaCorrecta = normalizar(respuestas[idLex]);

        guardarLeccion(usuario, idLex, 1);

        tiempoRestante = Number(sessionStorage.getItem(claveTiempo)) || TIEMPO_INICIAL;

        actualizarProgreso();

        mostrarBanco();

        mostrarRespuesta();

        iniciarTemporizador();

    } catch (error) {
        console.error("ERROR AL CARGAR LA LECCIÓN:", error);
        alert(error.message);
    }
}

function mostrarBanco() {
    banco.innerHTML = "";

    bancoPalabras.forEach((palabra, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = palabra;
        boton.classList.add("palabra");

        const seleccionada = palabrasSeleccionadas.includes(indice);
        boton.disabled = seleccionada;

        if (seleccionada) {
            boton.classList.add("seleccionada");
        }

        boton.addEventListener("click", () => {
            seleccionarPalabra(indice);
        });

        banco.appendChild(boton);
    });
}

function seleccionarPalabra(indice) {
    if (finalizada || palabrasSeleccionadas.includes(indice)) return;

    palabrasSeleccionadas.push(indice);

    mostrarBanco();
    mostrarRespuesta();
}

function pausarYVolver() {
    if (finalizada) return;

    clearInterval(temporizador);

    sessionStorage.setItem(claveTiempo, tiempoRestante);

    volverAUnidad();
}

function mostrarRespuesta() {
    respuestaUsuario.innerHTML = "";

    if (palabrasSeleccionadas.length === 0) {
        const placeholder = document.createElement("span");

        placeholder.textContent =
            "Seleccioná las palabras para formar la traducción";

        placeholder.classList.add("placeholder-respuesta");
        respuestaUsuario.appendChild(placeholder);

        return;
    }

    palabrasSeleccionadas.forEach((indice, posicion) => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = bancoPalabras[indice];
        boton.classList.add("palabra-respuesta");

        boton.addEventListener("click", () => {
            quitarPalabra(posicion);
        });

        respuestaUsuario.appendChild(boton);
    });
}

function quitarPalabra(posicion) {
    if (finalizada) return;

    palabrasSeleccionadas.splice(posicion, 1);

    mostrarBanco();
    mostrarRespuesta();
}

function comprobarRespuesta() {
    if (finalizada || palabrasSeleccionadas.length === 0) return;

    const respuestaUsuarioTexto = palabrasSeleccionadas
        .map(indice => bancoPalabras[indice])
        .join(" ");

    if (normalizar(respuestaUsuarioTexto) === respuestaCorrecta) {
        terminarLeccion();
    } else {
        mostrarError();
    }
}

function mostrarError() {
    const botones = respuestaUsuario.querySelectorAll("button");

    botones.forEach(boton => {
        boton.classList.add("incorrecta");
        boton.disabled = true;
    });

    botonEnviar.disabled = true;

    setTimeout(() => {
        palabrasSeleccionadas = [];

        mostrarBanco();
        mostrarRespuesta();

        botonEnviar.disabled = false;
    }, 650);
}

function terminarLeccion() {
    finalizada = true;
    clearInterval(temporizador);

    sessionStorage.removeItem(claveTiempo);

    // Guarda el progreso y suma puntos y racha (viene de puntos.js)
    const resultado = completarLeccion(usuario, idLex, 100);
    actualizarProgreso(100);

    mensajeModal.textContent =
        `¡RESPUESTA CORRECTA! +${resultado.puntosGanados} puntos | Racha: ${resultado.racha} 🔥`;
    modal.showPopover();
}

function actualizarProgreso() {
    const tiempoTranscurrido = TIEMPO_INICIAL - tiempoRestante;

    const progresoTiempo = (tiempoTranscurrido / TIEMPO_INICIAL) * 100;

    barraProgreso.style.width = progresoTiempo + "%";

    const minutos = Math.floor(tiempoTranscurrido / 60);
    const segundos = tiempoTranscurrido % 60;

    tiempoHTML.textContent =
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")} / 01:30`;
}

function iniciarTemporizador() {
    actualizarTiempo();

    temporizador = setInterval(() => {
        tiempoRestante--;
        actualizarTiempo();
        actualizarProgreso();

        if (tiempoRestante <= 0) {
            abandonarLeccion("Se agotó el tiempo. ¡Volvé a intentarlo!");
        }
    }, 1000);
}

function actualizarTiempo() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;

    tiempoHTML.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0");
}

function abandonarLeccion(mensaje) {
    if (finalizada) return;

    finalizada = true;

    clearInterval(temporizador);

    reiniciarLeccion(usuario, idLex);
    //esto
    quitarPuntosUnidad(usuario, [idLex]);
    //por esto
    //reiniciarLeccion(usuario, idLex);
    //romperRacha(usuario);
    alert(mensaje);
    volverAUnidad();
}

function volverAUnidad() {
    window.location.href =
        "../TresLecciones/unidad.html?idioma=" +
        encodeURIComponent(idioma) +
        "&unidad=" +
        encodeURIComponent(unidadId);
}

botonEnviar.addEventListener("click", comprobarRespuesta);

botonAbandonar.addEventListener("click", () => {
    abandonarLeccion("Abandonaste la lección.");
});

botonCerrarModal.addEventListener("click", () => {
    modal.hidePopover();
    volverAUnidad();
});
document.getElementById("btn-volver").addEventListener("click", pausarYVolver);
cargarLeccion();

})();