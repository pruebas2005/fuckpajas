// 1. Configuración de conexión (Igual que en la otra página)
const SUPABASE_URL = 'https://vkjcfhxxmtmlgynmtpby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GfGmOiq3CazPywMtfh4xNA_R335BXeT';
const conexionBD = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- FUNCIÓN PARA EL RANKING TOTAL ---
async function cargarRankingTotal() {
    const contenedor = document.getElementById('ranking-total');
    const filtroOpcion = document.querySelector('input[name="opcion1"]:checked')?.value;

    contenedor.innerHTML = "Cargando...";

    let consulta = conexionBD.from('registro_pajas').select('id_user');

    // Filtramos por categoría si no es "Todas"
    if (filtroOpcion) {
        consulta = consulta.eq('opcion', filtroOpcion);
    }

    const { data, error } = await consulta;

    if (error) return contenedor.innerHTML = "Error al cargar";

    mostrarResultados(data, contenedor);
}

// --- FUNCIÓN PARA EL RANKING POR MES ---
async function cargarRankingMes() {
    const contenedor = document.getElementById('ranking-mes');
    const filtroOpcion = document.querySelector('input[name="opcion2"]:checked')?.value;
    const mesElegido = document.getElementById('mes').value; // Formato "YYYY-MM"

    if (!mesElegido) return alert("Selecciona un mes primero, caballero");

    contenedor.innerHTML = "Cargando...";

    // Calculamos el inicio y fin del mes para SQL
    const inicioMes = `${mesElegido}-01T00:00:00Z`;
    const finMes = `${mesElegido}-31T23:59:59Z`;

    let consulta = conexionBD.from('registro_pajas')
        .select('id_user')
        .gte('momento', inicioMes)
        .lte('momento', finMes);

    if (filtroOpcion) {
        consulta = consulta.eq('opcion', filtroOpcion);
    }

    const { data, error } = await consulta;

    if (error) return contenedor.innerHTML = "Error al cargar";

    mostrarResultados(data, contenedor);
}

// --- AYUDANTE PARA DIBUJAR LOS DATOS ---
function mostrarResultados(data, contenedor) {
    if (data.length === 0) {
        contenedor.innerHTML = "Sin registros";
        return;
    }

    // Contamos ocurrencias
    const conteo = {};
    data.forEach(reg => {
        conteo[reg.id_user] = (conteo[reg.id_user] || 0) + 1;
    });

    // Ordenamos de mayor a menor
    const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

    // Lo metemos en el HTML con un poco de estilo
    contenedor.innerHTML = ranking.map(([nombre, total], i) => `
        <div style="width:100%; border-bottom: 1px solid #eee; padding: 5px; display: flex; justify-content: space-between;">
            <span><strong>#${i + 1}</strong> ${nombre}</span>
            <span>${total} 💦</span>
        </div>
    `).join('');
}

// Asignar eventos a los botones
document.getElementById('actualizar').addEventListener('click', cargarRankingTotal);
document.getElementById('actualizar2').addEventListener('click', cargarRankingMes);

// Cargar el total automáticamente al entrar
cargarRankingTotal();