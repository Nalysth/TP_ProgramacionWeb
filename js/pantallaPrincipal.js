
const usuarioActivo = obtenerUsuarioActivo();

const META_DIARIA = 50;

if (usuarioActivo) {

    const progreso = usuarioActivo.progreso;

    const nombre = usuarioActivo.nombre;
    const racha = progreso.racha ?? 0;
    const puntos = progreso.puntos ?? 0;

    document.getElementById("saludo").textContent =
        `¡Hola, ${nombre}!`;

    document.getElementById("rachaNav").textContent = racha;

    document.getElementById("puntosNav").textContent =
        `${puntos} XP`;

    document.getElementById("rachaEstadistica").textContent =
        racha;

    const fecha = fechaActualDashboard();

    const xpHoy = progreso.fechaXP === fecha
        ? Number(progreso.xpHoy ?? 0)
        : 0;

    document.getElementById("metaDiaria").textContent =
        `${xpHoy}/${META_DIARIA} XP`;

    cargarCursos(usuarioActivo);
}

function fechaActualDashboard() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

async function cargarCursos(usuario) {

    try {
        const respuesta = await fetch("../IndiceUnidades/ListaUnidades.json");
        const cursos = await respuesta.json();

        const niveles = {
            "Inglés": "Intermedio (B1)",
            "Alemán": "Principiante (A1)",
            "ChinoMandarin": "Inicial"
        };

        const tarjetas = document.querySelectorAll(".curso[data-idioma]");

        tarjetas.forEach(tarjeta => {

            const idioma = tarjeta.dataset.idioma;
            const curso = cursos[idioma];

            if (!curso) return;

            const lecciones = curso.unidades.flatMap(
                unidad => unidad.lecciones
            );

            const progresoLecciones = usuario.progreso.lecciones ?? {};

            const porcentajes = lecciones.map(leccion => {
                const valor = Number(
                    progresoLecciones[leccion.idLex] ?? 0
                );

                return Math.min(100, Math.max(0, valor));
            });

            const sumaPorcentajes = porcentajes.reduce(
                (total, porcentaje) => total + porcentaje,
                0
            );

            const porcentajeCurso = porcentajes.length > 0
                ? Math.round(sumaPorcentajes / porcentajes.length)
                : 0;

            const cursoIniciado = porcentajes.some(
                porcentaje => porcentaje > 0
            );

            tarjeta.querySelector(".valor-progreso").textContent =
                `${porcentajeCurso}%`;

            tarjeta.querySelector(".valor-nivel").textContent =
                niveles[idioma];

            tarjeta.querySelector(".texto-accion").textContent =
                cursoIniciado ? "Continuar" : "Comenzar";

        });

    } catch (error) {
        console.error("Error al cargar los cursos:", error);
    }
}
