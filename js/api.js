const BASE_URL = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';


export async function obtenerFotografia(fecha) {
  try {
    let url = '';

    if (fecha) {
      url = BASE_URL + '/' + fecha;
    } else {
      url = BASE_URL + '?per_page=1';
    }

    const respuesta = await fetch(url);
    if (respuesta.ok === false) {
      throw new Error('No se encontró la fotografía para la fecha consultada.');
    }

    const datos = await respuesta.json();

    if (fecha) {
      return datos;
    } else {
      return datos[0];
    }

  } catch (error) {
    console.error('Error al traer la foto:', error);
    throw error;
  }
}

export function mostrarFotografia(datos) {
  const titulo = document.getElementById('apod-titulo');
  const imagen = document.getElementById('apod-imagen');
  const fecha = document.getElementById('apod-fecha');
  const explicacion = document.getElementById('apod-explicacion');

  if (titulo) titulo.textContent = datos.title;
  if (fecha) fecha.textContent = datos.date;
  if (explicacion) explicacion.textContent = datos.explanation;
  
  if (imagen) {
    imagen.src = datos.url;
    imagen.alt = datos.title;
  }
}