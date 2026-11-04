cargarHeaderYFooterConDatos('/footers-y-headers/headerCompleto.html', '/footers-y-headers/footerCompleto.html'); 
    
// Creo un array con los datos que voy a necesitar:
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
    
// busco el dato en la url para llevarlo al array de datos y asi modificar la pagina depenfiendo de la opcion:
const parametroDeDato = new URLSearchParams(window.location.search);
const seccionActual = parametroDeDato.get('seccion');
const configuracion = datos[seccionActual];
    
// Traigo los datos necesarios para configurar la pagina:
const tituloPrincipal = document.getElementById("tituloFormulario");
const primerLabel = document.getElementById("primerDato");
const segundoLabel = document.getElementById("segundoDato");
const primerCampo = document.getElementById("primerCampo");
const segundoCampo = document.getElementById("segundoCampo");

// Inscribo los datos en las etiquetas en el html
tituloPrincipal.textContent = configuracion.titulo;
primerLabel.textContent = configuracion.primerTituloLabel;
primerCampo.type = configuracion.tipoInput;
// Verifico si el tipo de dato es igual a nick, ya que ahi solamente se usa un solo label:
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

// Con el formulario, creo el evento al enviar el formulario:
formulario.addEventListener("submit", (e) => {
    
// Usando un switch, dependiendo de la opcion del dato, manda el tipo de dato correspondiende al localStorage:
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

// Creo una funcionar para no repetir codigo:
function verificarDatos(a, b){
    return(a === b)
}