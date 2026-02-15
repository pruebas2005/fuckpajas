const SUPABASE_URL = 'https://vkjcfhxxmtmlgynmtpby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GfGmOiq3CazPywMtfh4xNA_R335BXeT';
const conexionBD = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- RANKING TOTAL ---
async function cargarRankingTotal() {
    const contenedor = document.getElementById('ranking-total');
    const filtroOpcion = document.querySelector('input[name="opcion1"]:checked')?.value;

    contenedor.innerHTML = "Cargando...";

    let consulta = conexionBD.from('registro_pajas').select('id_user');
    if (filtroOpcion) {
        consulta = consulta.eq('opcion', filtroOpcion);
    }

    const { data, error } = await consulta;
    if (error) return contenedor.innerHTML = "Error: " + error.message;

    mostrarResultados(data, contenedor);
}

// --- RANKING POR MES ---
async function cargarRankingMes() {
    const contenedor = document.getElementById('ranking-mes');
    const filtroOpcion = document.querySelector('input[name="opcion2"]:checked')?.value;
    const mesElegido = document.getElementById('mes').value;

    if (!mesElegido) return alert("Selecciona un mes primero, caballero");

    contenedor.innerHTML = "Cargando...";

    // Rango de fechas para el mes
    const [anio, mes] = mesElegido.split('-');
    const inicio = `${anio}-${mes}-01T00:00:00Z`;
    let proximoMes = parseInt(mes) + 1;
    let proximoAnio = parseInt(anio);
    if (proximoMes > 12) { proximoMes = 1; proximoAnio++; }
    const fin = `${proximoAnio}-${String(proximoMes).padStart(2, '0')}-01T00:00:00Z`;

    let consulta = conexionBD.from('registro_pajas')
        .select('id_user')
        .gte('momento', inicio)
        .lt('momento', fin);

    if (filtroOpcion) {
        consulta = consulta.eq('opcion', filtroOpcion);
    }

    const { data, error } = await consulta;
    if (error) return contenedor.innerHTML = "Error: " + error.message;

    mostrarResultados(data, contenedor);
}

// --- ESTA ES LA FUNCIÓN QUE TE FALTABA ---
function mostrarResultados(data, contenedor) {
    if (!data || data.length === 0) {
        contenedor.innerHTML = "No hay datos para esta selección.";
        return;
    }

    // Contamos cuántas lleva cada uno
    const conteo = {};
    data.forEach(reg => {
        conteo[reg.id_user] = (conteo[reg.id_user] || 0) + 1;
    });

    // Ordenamos de mayor a menor
    const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

    // Lo dibujamos en el HTML
    contenedor.innerHTML = ranking.map(([nombre, total], i) => `
        <div style="width:100%; display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
            <span><strong>#${i + 1}</strong> ${nombre}</span>
            <span>${total} 💦</span>
        </div>
    `).join('');
}

// Eventos
document.getElementById('actualizar').addEventListener('click', cargarRankingTotal);
document.getElementById('actualizar2').addEventListener('click', cargarRankingMes);

// Carga inicial
cargarRankingTotal();