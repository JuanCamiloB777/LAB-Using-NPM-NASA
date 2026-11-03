// Favoritos: guarda la fecha y el título de cada APOD en localStorage

const botonGuardar = document.getElementById("btn-favorito");
const listaFavoritos = document.getElementById("lista-favoritos");
const favoritosVacio = document.getElementById("favoritos-vacio");
const mensajeInfo = document.getElementById("mensaje-info");
const campoFecha = document.getElementById("input-fecha");
const formularioBuscador = document.getElementById("form-buscador");
const tituloApod = document.getElementById("apod-titulo");

const CLAVE_FAVORITOS = "favoritosAPOD";

// Si no hay nada guardado, localStorage.getItem devuelve null
let favoritos = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || [];

let temporizadorMensaje = null;

// Mostrar un aviso en la zona de mensajes
function mostrarMensaje(texto) {
    mensajeInfo.textContent = texto;
    mensajeInfo.hidden = false;

    clearTimeout(temporizadorMensaje);

    temporizadorMensaje = setTimeout(function () {
        mensajeInfo.hidden = true;
    }, 3000);
}

// Guardar la APOD que se está mostrando
botonGuardar.addEventListener("click", function () {
    const fecha = campoFecha.value;
    const titulo = tituloApod.textContent;

    // Si todavía no se cargó ninguna fotografía, no guardamos nada
    if (fecha === "" || titulo === "Título de la foto") {
        mostrarMensaje("Primero carga una fotografía para guardarla.");
        return;
    }

    // Revisar si ya existe un favorito con la misma fecha
    const yaExiste = favoritos.some(function (favorito) {
        return favorito.date === fecha;
    });

    if (yaExiste) {
        mostrarMensaje("Esta APOD ya está en tus favoritos.");
        return;
    }

    // Guardamos solo lo necesario: date y title
    favoritos.push({ date: fecha, title: titulo });

    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));

    mostrarFavoritos();
    mostrarMensaje("APOD guardada en favoritos.");
});

// Crear la lista de favoritos en el HTML
function mostrarFavoritos() {
    listaFavoritos.innerHTML = "";

    if (favoritos.length === 0) {
        favoritosVacio.hidden = false;
        return;
    }

    favoritosVacio.hidden = true;

    favoritos.forEach(function (favorito) {
        const item = document.createElement("li");
        item.className = "favorito";

        const botonAbrir = document.createElement("button");
        botonAbrir.type = "button";
        botonAbrir.className = "favorito__abrir";
        botonAbrir.dataset.fecha = favorito.date;

        const spanFecha = document.createElement("span");
        spanFecha.className = "favorito__fecha";
        spanFecha.textContent = dayjs(favorito.date).format("D [de] MMMM [de] YYYY");

        const spanNombre = document.createElement("span");
        spanNombre.className = "favorito__nombre";
        spanNombre.textContent = favorito.title;

        botonAbrir.appendChild(spanFecha);
        botonAbrir.appendChild(spanNombre);

        // Al hacer clic en un favorito se carga esa APOD
        botonAbrir.addEventListener("click", function () {
            campoFecha.value = favorito.date;
            formularioBuscador.requestSubmit();
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "favorito__eliminar";
        botonEliminar.textContent = "✕";
        botonEliminar.setAttribute("aria-label", "Eliminar de favoritos");

        botonEliminar.addEventListener("click", function () {
            favoritos = favoritos.filter(function (guardado) {
                return guardado.date !== favorito.date;
            });

            localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));

            mostrarFavoritos();
            mostrarMensaje("Favorito eliminado.");
        });

        item.appendChild(botonAbrir);
        item.appendChild(botonEliminar);

        listaFavoritos.appendChild(item);
    });
}

// Pintar los favoritos guardados al abrir la página
mostrarFavoritos();
