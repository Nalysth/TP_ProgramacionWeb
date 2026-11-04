// Extraigo todo el contenido del html
async function cargarDatos(idDestino, archivo) {
    const carga = await fetch(archivo);
    const html = await carga.text();
    document.getElementById(idDestino).innerHTML = html;
}

// Guardo el contenido en los id's del header y footer:
async function iniciarDatos(archivoHeader, archivoFooter) {
    await cargarDatos('header', archivoHeader);
    await cargarDatos('footer', archivoFooter);
};

// Una vez que el header y footer esten cargardos, los datos de la racha y puntos se suben
async function cargarHeaderYFooterConDatos(archivoHeader, archivoFooter) {
    await iniciarDatos(archivoHeader , archivoFooter);
    
    const rachaActual = document.getElementById('rachaActual');
    const puntos = document.getElementById('xpHoy');

    rachaActual.textContent = usuarioActual.progreso.racha;
    puntos.textContent = usuarioActual.progreso.puntos + ' XP';
    
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    btnCerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('usuarioActivo');
    })
}