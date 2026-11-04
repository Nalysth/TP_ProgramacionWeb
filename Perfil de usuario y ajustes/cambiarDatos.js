cargarHeaderYFooterConDatos('/footers-y-headers/headerCompleto.html', '/footers-y-headers/footerCompleto.html'); 
    
const datos = { 
    "contraseña": {
        titulo: "Cambiar Contraseña",
        primerTituloLabel: "Nueva Contraseña",
        segundoTituloLabel: "Confirmar Contraseña",
        tipoInput: "password",
        storaKey: "contraseña"
    },
    "telefono": {
        titulo: "Cambiar Telefono",
        primerTituloLabel: "Nuevo Telefono",
        segundoTituloLabel: "Confirmar Telefono",
        tipoInput: "tel",
        storaKey: "telefono"
    },
    "nick": {
        titulo: "Cambiar Nick",
        primerTituloLabel: "Nuevo Nick",
        tipoInput: "text",
        storaKey: "nick"
    }
}
    
    // busco el dato en la url para que entre al switch y cambiar el dato
    const parametroDeDato = new URLSearchParams(window.location.search);
    const seccionActual = parametroDeDato.get('seccion');
    const configuracion = datos[seccionActual];
    

const tituloPrincipal = document.getElementById("tituloFormulario");
const primerLabel = document.getElementById("primerDato");
const segundoLabel = document.getElementById("segundoDato");
const primerCampo = document.getElementById("primerCampo");
const segundoCampo = document.getElementById("segundoCampo");


tituloPrincipal.textContent = configuracion.titulo;
primerLabel.textContent = configuracion.primerTituloLabel;
primerCampo.type = configuracion.tipoInput;

if(seccionActual === 'nick'){
    segundoLabel.style.display = 'none';
    segundoCampo.style.display = 'none';
    segundoCampo.required = false;
} else {
    segundoLabel.textContent = configuracion.segundoTituloLabel;
    segundoCampo.type = configuracion.tipoInput;
}

// Traigo el formulario y el usuario:
const formulario = document.getElementById("formulario");
const usuarioActual = obtenerUsuarioActivo();

formulario.addEventListener("submit", (e) => {
    
// switch = dependiend del dato que se mando por la url va a entrar un caso hace la V y usa la funicon para poder mandarlo al LS
switch(seccionActual){
case 'contraseña':
    if(verificarDatos(primerCampo.value, segundoCampo.value)){
        usuarioActual.contraseña = primerCampo.value;
        guardarUsuario(usuarioActual);
    } else{
        e.preventDefault();
    }
    break;
case 'nick':
        usuarioActual.usuario = primerCampo.value
        guardarUsuario(usuarioActual);
    break;
case 'telefono':
    if(verificarDatos(primerCampo.value, segundoCampo.value)){
        usuarioActual.telefono = primerCampo.value;
        guardarUsuario(usuarioActual);
    } else{
        e.preventDefault();
    }
    break;
}
})

// Creo una funcionar para verificar que sean iguales
function verificarDatos(a, b){
    return(a === b)
}