const email = document.getElementById("email");
const pass = document.getElementById("contrasenia");
const form = document.getElementById("form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e){
    e.preventDefault();
    mensaje.textContent = "";
    let camposCompletos = true;
    if(email.value == "" ){ 
        mensaje.textContent+= "ingresar un email\n";
        camposCompletos = false;
    }
    if(pass.value == ""){ 
        mensaje.textContent +="ingresar una contraseña\n";
    camposCompletos= false;
    }
    if(camposCompletos){
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
        const usuarioEncontrado = listaUsuarios.find(usuario => usuario.email == email.value && usuario.contraseña == pass.value)
        if(usuarioEncontrado){
            localStorage.setItem("usuarioActivo", usuarioEncontrado.email);
            window.location.href = "../html/pantallaPrincipal.html";
        }
        else
            mensaje.textContent += "usuario o contraseña incorrectos";
        
    }
})