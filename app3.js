const SUPABASE_URL = 'https://vkjcfhxxmtmlgynmtpby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GfGmOiq3CazPywMtfh4xNA_R335BXeT';
const conexionBD = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarComentarios() {
    const contenedor = document.getElementById('comentarios');
    if (!contenedor) return;

    contenedor.innerHTML = "<p>Buscando pruebas del delito...</p>";

    // .neq('url', '') filtra para que NO traiga las que están vacías
    // .not('url', 'is', null) asegura que tampoco traiga las nulas
    const { data, error } = await conexionBD
        .from('registro_pajas')
        .select('id_user, momento, url, opcion')
        .neq('url', '')
        .not('url', 'is', null)
        .order('momento', { ascending: false })
        .limit(20);

    if (error) {
        contenedor.innerHTML = "Error: " + error.message;
        return;
    }

    mostrarComentarios(data, contenedor);
}

function mostrarComentarios(data, contenedor) {
    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p>Nadie ha dejado nada todavía. ¡Panda de cobardes!</p>";
        return;
    }

    contenedor.innerHTML = data.map(reg => {
        const fecha = new Date(reg.momento).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div style="width:100%; padding: 15px; border-bottom: 1px solid #ddd; margin-bottom: 10px; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #1100ff; font-size: 1.1em;">${reg.id_user}</strong>
                    <small style="color: #888;">${fecha}</small>
                </div>
                <div style="text-align: center;">
                   ${reg.url}
                </div>
            </div>
        `;
    }).join('');
}
document.addEventListener('DOMContentLoaded', cargarComentarios);