const nombre = document.getElementById("nombre");
const usuario = document.getElementById("usuario");
const email = document.getElementById("email");
const tel = document.getElementById("telefono");
const pass = document.getElementById("password");
const rpass = document.getElementById("r-password");
const form = document.getElementById("form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e){
    e.preventDefault();
    mensaje.textContent = "";
    let  errores = 6;

    if(validarNombre(nombre) == false){
        errores --;
        mensaje.textContent += "El nombre debe tener al menos 3 caracteres\n";
    }
        

    if(validarUsuario(usuario) == false){
        errores --;
        mensaje.textContent += "El nombre de usuario debe tener al menos 3 caracteres\n";
    }

    if(validarEmail(email) == false){
        errores --;
        mensaje.textContent += "El email debe tener @ y .\n";
    }

    if(validarTelefono(tel) == false){
        errores --;
        mensaje.textContent += "El telefono debe tener minomo 10 digitos\n";
    }

    if(validarTamanioContrasenia(pass) == false){
        errores --;
        mensaje.textContent += "la contraseña debe tener 8 digitos\n";
    }

    if(validarContrasenia(pass,rpass) == false){
        errores --;
        mensaje.textContent += "las contraseñas no coinciden\n";
    }

    if( errores == 6){
        const nuevoUsuario = {
            nombre: nombre.value,
            usuario: usuario.value,
            email: email.value,
            telefono: tel.value,
            contraseña: pass.value,
            progreso: {
                lecciones: {},
                puntos: 0,
                racha: 0,
                mejorRacha: 0,
                ganadas: {}
            }
        };

        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
        //some comprueba si un elemento de un array cumple la condicion
        const emailOcupado = listaUsuarios.some(usuario => usuario.email === email.value);

        if (emailOcupado) {
            mensaje.textContent = "Este email ya está registrado.";
            return;
        }
        listaUsuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

        localStorage.setItem("usuarioActivo", nuevoUsuario.email);

        window.location.href = "../html/pantallaPrincipal.html";
    }
});

function validarNombre(nombre){

    if( nombre.value.length >= 3 ){
        return true;
    }
     return false;

}

function validarUsuario( usuario){

    if( usuario.value.length >=3){
        return true;
    }
     return false;

}

function validarEmail(email){
    if(email.value.includes("@") && email.value.includes(".")){
        return true;
    }
    return false;
}

function validarTelefono(telefono) {
    // si es umero tira false
    if (!isNaN(telefono.value) && telefono.value.trim() !== "" && telefono.value.length >= 10) {
        return true;
    }
    return false;
}

function validarContrasenia(pass, rpass){
    if( pass.value === rpass.value){
        return true;
    }
    return false;
}

function validarTamanioContrasenia(pass){
    if (pass.value.length >= 8){
        return true;
    }
    return false;
}
