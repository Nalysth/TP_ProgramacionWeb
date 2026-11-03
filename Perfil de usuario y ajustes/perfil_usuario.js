// Traigo todos los datos necesarios:
const email = document.getElementById("mailDato")
const telefono = document.getElementById("telDato")
const contraseña = document.getElementById("contraseñaDato")
const nick = document.getElementById("nickDato")

// Hardcoreo los datos personales:
if(!localStorage.getItem('mail')){
    localStorage.setItem("mail", "guanaTalk_oficial@gmail.com")
}

if(!localStorage.getItem('contraseña')){
    localStorage.setItem('contraseña', 12345)
}

if(!localStorage.getItem('nick')){
    localStorage.setItem('nick', 'Guana89')
}

if(!localStorage.getItem('telefono')){
    localStorage.setItem('telefono', 11223344)
}

// Establesco los datos a partir del localStorage: 
email.textContent = localStorage.getItem("mail");
telefono.textContent = localStorage.getItem('telefono');
nick.textContent = localStorage.getItem('nick');
