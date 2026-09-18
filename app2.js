const SUPABASE_URL = 'https://vkjcfhxxmtmlgynmtpby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GfGmOiq3CazPywMtfh4xNA_R335BXeT';
const conexionBD = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- RANKING TOTAL ---
async function cargarRankingTotal() {
    const contenedor = document.getElementById('ranking-total');
    const filtroOpcion = document.querySelector('input[name="opcion1"]:checked')?.value || null;

    contenedor.innerHTML = "Cargando...";

    // El conteo y el agrupado se hacen en la base de datos (función RPC),
    // así que nunca viajan más de N filas (una por usuario) al cliente,
    // sin importar cuántos registros haya en la tabla.
    const { data, error } = await conexionBD.rpc('ranking_total', {
        filtro_opcion: filtroOpcion
    });

    if (error) return contenedor.innerHTML = "Error: " + error.message;

    mostrarResultadosAnio(data, contenedor);
}

// --- RANKING POR MES ---
async function cargarRankingMes() {
    const contenedor = document.getElementById('ranking-mes');
    const filtroOpcion = document.querySelector('input[name="opcion2"]:checked')?.value || null;
    const mesElegido = document.getElementById('mes').value;

    if (!mesElegido) return alert("Selecciona un mes primero, caballero");

    contenedor.innerHTML = "Cargando...";

    const [anio, mes] = mesElegido.split('-');

    // --- LÓGICA DE PROMEDIOS (igual que antes) ---
    const fechaHoy = new Date();
    const anioHoy = fechaHoy.getFullYear();
    const mesHoy = fechaHoy.getMonth() + 1;
    const diaHoy = fechaHoy.getDate();

    let diasParaPromedio;
    if (parseInt(anio) < anioHoy || (parseInt(anio) === anioHoy && parseInt(mes) < mesHoy)) {
        diasParaPromedio = new Date(parseInt(anio), parseInt(mes), 0).getDate();
    } else if (parseInt(anio) === anioHoy && parseInt(mes) === mesHoy) {
        diasParaPromedio = diaHoy;
    } else {
        diasParaPromedio = new Date(parseInt(anio), parseInt(mes), 0).getDate();
    }

    const inicio = `${anio}-${mes}-01T00:00:00Z`;
    let proximoMes = parseInt(mes) + 1;
    let proximoAnio = parseInt(anio);
    if (proximoMes > 12) { proximoMes = 1; proximoAnio++; }
    const fin = `${proximoAnio}-${String(proximoMes).padStart(2, '0')}-01T00:00:00Z`;

    const { data, error } = await conexionBD.rpc('ranking_mes', {
        fecha_inicio: inicio,
        fecha_fin: fin,
        filtro_opcion: filtroOpcion
    });

    if (error) return contenedor.innerHTML = "Error: " + error.message;

    mostrarResultadosMes(data, contenedor, diasParaPromedio);
}

// --- MOSTRAR RESULTADOS TOTALES ---
// data ya viene agregado y ordenado desde la base de datos: [{id_user, total}, ...]
function mostrarResultadosAnio(data, contenedor) {
    if (!data || data.length === 0) {
        contenedor.innerHTML = "No hay datos para esta selección.";
        return;
    }

    contenedor.innerHTML = data.map((fila, i) => `
        <div style="width:100%; color: white;display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
            <span><strong>#${i + 1}</strong> ${fila.id_user}</span>
            <span>${fila.total} 💦</span>
        </div>
    `).join('');
}

// --- MOSTRAR RESULTADOS MENSUALES ---
function mostrarResultadosMes(data, contenedor, diasParaPromedio) {
    if (!data || data.length === 0) {
        contenedor.innerHTML = "No hay datos para esta selección.";
        return;
    }

    contenedor.innerHTML = data.map((fila, i) => `
        <div style="width:100%;color: white; display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
            <span><strong>#${i + 1}</strong> ${fila.id_user}</span>
            <span><strong>promedio: </strong>${(fila.total / diasParaPromedio).toFixed(1)}/día</span>
            <span>${fila.total} 💦</span>
        </div>
    `).join('');
}

// Eventos
document.getElementById('actualizar').addEventListener('click', cargarRankingTotal);
document.getElementById('actualizar2').addEventListener('click', cargarRankingMes);

// Carga inicial
cargarRankingTotal();
