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

        if (!respuesta.ok) {
            throw new Error('No se encontró la fotografía para la fecha consultada.');
        }

        const datos = await respuesta.json();

        return fecha ? datos : datos[0];

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
    const permalink = document.getElementById('apod-permalink');
    const enlaceVideo = document.getElementById('apod-video');

    if (titulo) {
        titulo.textContent = datos.title;
    }

    if (fecha) {
        fecha.textContent = dayjs(datos.date).format('D [de] MMMM [de] YYYY');
    }

    if (explicacion) {
        explicacion.innerHTML = datos.explanation;
    }

    if (permalink) {
        permalink.href = datos.permalink;
    }

    if (datos.media_type === 'video') {
        if (imagen) {
            imagen.hidden = true;
        }

        if (enlaceVideo) {
            enlaceVideo.href = datos.permalink;
            enlaceVideo.hidden = false;
        }

    } else {
        if (imagen) {
            imagen.src = datos.hdurl || datos.url;
            imagen.alt = datos.title;
            imagen.hidden = false;
        }

        if (enlaceVideo) {
            enlaceVideo.hidden = true;
        }
    }
}