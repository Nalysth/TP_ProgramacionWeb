async function cargarDatos(idDestino, archivo) {
    const carga = await fetch(archivo);
    const html = await carga.text();
    document.getElementById(idDestino).innerHTML = html;
}

async function iniciarDatos(archivoHeader, archivoFooter) {
    await cargarDatos('header', archivoHeader);
    await cargarDatos('footer', archivoFooter);
};