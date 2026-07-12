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
        .select('id_user, momento, url').order('momento', { ascending: false }).neq('url', '');

    if (error) {
        contenedor.innerHTML = "Error: " + error.message;
        return;
    }

    mostrarComentarios(data, contenedor);
}
function mostrarComentarios(data, contenedor) {
    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p>Nadie ha dejado pruebas... aún.</p>";
        return;
    }

    contenedor.innerHTML = data.map(reg => {
        const fecha = new Date(reg.momento).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Comprobamos si el contenido de 'url' empieza por http
        const esUrl = reg.url && reg.url.trim().toLowerCase().startsWith('http');

        return `
            <div style="width:100%; padding: 15px; border-bottom: 1px solid #eee; margin-bottom: 12px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong style="color: #fc651f;">👤${reg.id_user}</strong>
                    <small style="color: #999;">${fecha}</small>
                </div>
                
                <div style="margin: 10px 0; font-size: 0.95em; line-height: 1.4;">
                    ${esUrl
                ? `<a href="${reg.url}" target="_blank" style="color: #fc651f; word-break: break-all;">${reg.url}</a>`
                : `<span>${reg.url}</span>`
            }
                </div>
            </div>
        `;
    }).join('');

}

document.addEventListener('DOMContentLoaded', cargarComentarios);