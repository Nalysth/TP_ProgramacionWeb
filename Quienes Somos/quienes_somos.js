iniciarDatos('/footers-y-headers/headerSimple.html', '/footers-y-headers/footerSinMenu.html');

const btnVolver = document.getElementById('volver');
const EstaUsuarioActivo = localStorage.getItem('usuarioActivo');

btnVolver.addEventListener('click', (e) => {
    if(EstaUsuarioActivo === null){
        e.preventDefault();
        window.location.href = "/index.html";
    }
})