dayjs.locale("es");

// Sin el ?per_page=1: lo agrega solo la petición de "hoy"
const BASE_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";

// APOD que se está mostrando (la usa el Integrante 4 para favoritos)
let apodActual = null;

// Pide la APOD a la API.
// fecha: texto AAMMDD (ej. "240315"). Si no se pasa, trae la de hoy.
async function obtenerFotografia(fecha) {
  let url;

  if (fecha) {
    url = BASE_URL + "/" + fecha;
  } else {
    url = BASE_URL + "?per_page=1";
  }

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error("No hay APOD para esa fecha");
  }

  const datos = await respuesta.json();

  // Hoy devuelve un arreglo; una fecha devuelve un objeto
  return fecha ? datos : datos[0];
}

// Pinta una APOD en pantalla
function mostrarFotografia(apod) {
  const titulo = document.getElementById("apod-titulo");
  const fecha = document.getElementById("apod-fecha");
  const imagen = document.getElementById("apod-imagen");
  const explicacion = document.getElementById("apod-explicacion");
  const permalink = document.getElementById("apod-permalink");
  const enlaceVideo = document.getElementById("apod-video");

  titulo.textContent = apod.title;
  fecha.textContent = dayjs(apod.date).format("D [de] MMMM [de] YYYY");
  imagen.src = apod.hdurl;
  imagen.alt = apod.title;
  explicacion.innerHTML = apod.explanation;
  permalink.href = apod.permalink;

  if (apod.media_type === "video") {
    enlaceVideo.href = apod.permalink;
    enlaceVideo.hidden = false;
  } else {
    enlaceVideo.hidden = true;
  }

  apodActual = apod;
}

// Función reutilizable: carga y muestra una APOD.
// Uso: cargarApod()          -> la de hoy
//      cargarApod("240315")  -> la del 15 de marzo de 2024
async function cargarApod(fecha) {
  const cargando = document.getElementById("cargando");
  const mensajeError = document.getElementById("mensaje-error");

  cargando.hidden = false;
  mensajeError.hidden = true;

  try {
    const apod = await obtenerFotografia(fecha);
    mostrarFotografia(apod);
  } catch (error) {
    mensajeError.textContent = error.message;
    mensajeError.hidden = false;
  } finally {
    cargando.hidden = true;
  }
}

// Al abrir la página, carga la de hoy
cargarApod();