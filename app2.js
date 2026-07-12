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

    mostrarResultadosAnio(data, contenedor);
}

// --- RANKING POR MES ---
async function cargarRankingMes() {
    const contenedor = document.getElementById('ranking-mes');
    const filtroOpcion = document.querySelector('input[name="opcion2"]:checked')?.value;
    const mesElegido = document.getElementById('mes').value;

    if (!mesElegido) return alert("Selecciona un mes primero, caballero");

    contenedor.innerHTML = "Cargando...";

    const [anio, mes] = mesElegido.split('-');

    // --- LÓGICA ESTRATÉGICA DE PROMEDIOS ---
    const fechaHoy = new Date();
    const anioHoy = fechaHoy.getFullYear();
    const mesHoy = fechaHoy.getMonth() + 1; // Enero es 0 en JS, sumamos 1
    const diaHoy = fechaHoy.getDate();

    let diasParaPromedio;

    // Escenario 1: Mes pasado
    if (parseInt(anio) < anioHoy || (parseInt(anio) === anioHoy && parseInt(mes) < mesHoy)) {
        diasParaPromedio = new Date(parseInt(anio), parseInt(mes), 0).getDate();
    }
    // Escenario 2: Mes actual
    else if (parseInt(anio) === anioHoy && parseInt(mes) === mesHoy) {
        diasParaPromedio = diaHoy;
    }
    // Escenario 3: Mes futuro
    else {
        diasParaPromedio = new Date(parseInt(anio), parseInt(mes), 0).getDate();
    }

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

    mostrarResultadosMes(data, contenedor, diasParaPromedio);
}

// --- MOSTRAR RESULTADOS TOTALES ---
function mostrarResultadosAnio(data, contenedor) {
    if (!data || data.length === 0) {
        contenedor.innerHTML = "No hay datos para esta selección.";
        return;
    }

    const conteo = {};
    data.forEach(reg => {
        conteo[reg.id_user] = (conteo[reg.id_user] || 0) + 1;
    });

    const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

    contenedor.innerHTML = ranking.map(([nombre, total], i) => `
        <div style="width:100%; display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
            <span><strong>#${i + 1}</strong> ${nombre}</span>
            <span>${total} 💦</span>
        </div>
    `).join('');
}

// --- MOSTRAR RESULTADOS MENSUALES ---
function mostrarResultadosMes(data, contenedor, diasParaPromedio) {
    if (!data || data.length === 0) {
        contenedor.innerHTML = "No hay datos para esta selección.";
        return;
    }

    const conteo = {};
    data.forEach(reg => {
        conteo[reg.id_user] = (conteo[reg.id_user] || 0) + 1;
    });

    const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

    contenedor.innerHTML = ranking.map(([nombre, total], i) => `
        <div style="width:100%; display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
            <span><strong>#${i + 1}</strong> ${nombre}</span>
            <span><strong>promedio: </strong>${(total / diasParaPromedio).toFixed(1)}/día</span>
            <span>${total} 💦</span>
        </div>
    `).join('');
}

// Eventos
document.getElementById('actualizar').addEventListener('click', cargarRankingTotal);
document.getElementById('actualizar2').addEventListener('click', cargarRankingMes);

// Carga inicial
cargarRankingTotal();
