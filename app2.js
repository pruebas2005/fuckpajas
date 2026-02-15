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
    const mesElegido = document.getElementById('mes').value; // Ejemplo: "2026-02"

    if (!mesElegido) return alert("Selecciona un mes primero, caballero");

    contenedor.innerHTML = "Cargando...";

    // 1. Desmontamos el año y mes (ej: "2026" y "02")
    const [anio, mes] = mesElegido.split('-');

    // 2. Definimos el inicio: día 01 a las 00:00:00
    const inicio = `${anio}-${mes}-01T00:00:00Z`;

    // 3. Calculamos el inicio del mes siguiente de forma automática
    let proximoMes = parseInt(mes) + 1;
    let proximoAnio = parseInt(anio);

    if (proximoMes > 12) {
        proximoMes = 1;
        proximoAnio++;
    }

    // Formateamos el mes siguiente para que siempre tenga dos dígitos (ej: "03")
    const mesSiguienteFormateado = String(proximoMes).padStart(2, '0');
    const fin = `${proximoAnio}-${mesSiguienteFormateado}-01T00:00:00Z`;

    // 4. Hacemos la consulta usando .lt (Less Than / Menor que)
    let consulta = conexionBD.from('registro_pajas')
        .select('id_user')
        .gte('momento', inicio) // Mayor o igual al 1 de febrero
        .lt('momento', fin);    // MENOR estricto al 1 de marzo

    if (filtroOpcion) {
        consulta = consulta.eq('opcion', filtroOpcion);
    }

    const { data, error } = await consulta;

    if (error) {
        console.error("Error de Supabase:", error);
        return contenedor.innerHTML = "Error al cargar: " + error.message;
    }

    mostrarResultados(data, contenedor);
}

// Asignar eventos a los botones
document.getElementById('actualizar').addEventListener('click', cargarRankingTotal);
document.getElementById('actualizar2').addEventListener('click', cargarRankingMes);

// Cargar el total automáticamente al entrar
cargarRankingTotal();