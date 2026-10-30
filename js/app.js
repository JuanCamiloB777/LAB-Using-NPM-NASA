import { obtenerFotografia, mostrarFotografia } from "./api.js";

dayjs.locale("es");

const formularioBuscador = document.getElementById("form-buscador");
const inputFecha = document.getElementById("input-fecha");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const mensajeError = document.getElementById("mensaje-error");
const mensajeInfo = document.getElementById("mensaje-info");
const cargando = document.getElementById("cargando");

const fechaMinima = "1995-06-16";
const fechaHoy = dayjs().format("YYYY-MM-DD");

inputFecha.max = fechaHoy;

formularioBuscador.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const fechaSeleccionada = inputFecha.value;

    mensajeError.hidden = true;
    mensajeInfo.hidden = true;

    if (fechaSeleccionada === "") {
        mensajeError.textContent = "Por favor, selecciona una fecha.";
        mensajeError.hidden = false;
        return;
    }

    if (dayjs(fechaSeleccionada).isBefore(dayjs(fechaMinima), "day")) {
        mensajeError.textContent = "La fecha debe ser desde el 16 de junio de 1995.";
        mensajeError.hidden = false;
        return;
    }

    if (dayjs(fechaSeleccionada).isAfter(dayjs(), "day")) {
        mensajeError.textContent = "No puedes seleccionar una fecha futura.";
        mensajeError.hidden = false;
        return;
    }

    const fechaAPI = dayjs(fechaSeleccionada).format("YYMMDD");

    try {
        cargando.hidden = false;

        const datos = await obtenerFotografia(fechaAPI);
        console.log("Datos recibidos de la NASA:", datos);
        mostrarFotografia(datos);
        mensajeInfo.textContent = "Fotografía cargada correctamente.";
        mensajeInfo.hidden = false;

    } catch (error) {
        console.error("Error al consultar NASA:", error);
        mensajeError.textContent = "No fue posible conectar con NASA. Verifica tu conexión e inténtalo nuevamente.";
        mensajeError.hidden = false;

    } finally {
        cargando.hidden = true;
    }
});
btnAnterior.addEventListener("click", function () {
    const fechaActual = inputFecha.value;
    mensajeError.hidden = true;
    mensajeInfo.hidden = true;

    if (!fechaActual) {
        mensajeError.textContent = "Primero selecciona una fecha.";
        mensajeError.hidden = false;
        return;
    }

    const fechaAnterior = dayjs(fechaActual).subtract(1, "day");

    if (fechaAnterior.isBefore(dayjs(fechaMinima), "day")) {
        mensajeError.textContent = "No hay fechas anteriores al 16 de junio de 1995.";
        mensajeError.hidden = false;
        return;
    }

    inputFecha.value = fechaAnterior.format("YYYY-MM-DD");
    formularioBuscador.requestSubmit();
});
btnSiguiente.addEventListener("click", function () {
    const fechaActual = inputFecha.value;
    mensajeError.hidden = true;
    mensajeInfo.hidden = true;

    if (!fechaActual) {
        mensajeError.textContent = "Primero selecciona una fecha.";
        mensajeError.hidden = false;
        return;
    }

    const fechaSiguiente = dayjs(fechaActual).add(1, "day");

    if (fechaSiguiente.isAfter(dayjs(), "day")) {
        mensajeError.textContent = "No puedes consultar fechas futuras.";
        mensajeError.hidden = false;
        return;
    }

    inputFecha.value = fechaSiguiente.format("YYYY-MM-DD");
    formularioBuscador.requestSubmit();
});