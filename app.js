// 1. TUS CLAVES DE SUPABASE
const SUPABASE_URL = 'https://vkjcfhxxmtmlgynmtpby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GfGmOiq3CazPywMtfh4xNA_R335BXeT'; // Asegúrate de que pegaste la clave COMPLETA aquí.

// 2. Inicializamos la conexión (¡Le cambiamos el nombre a conexionBD para evitar el error!)
const conexionBD = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Le decimos al botón qué hacer cuando alguien envíe el formulario
document.getElementById('formulario-colegas').addEventListener('submit', async function (evento) {
    // Esto evita que la página parpadee o se recargue al darle al botón
    evento.preventDefault();

    // Cambiamos el texto del botón para que parezca que está cargando
    const boton = document.getElementById('sumar');
    boton.innerText = "Enviando...";

    // Recogemos los datos que ha escrito el colega en la web
    const nombreUsuario = document.getElementById('name').value;
    const coment = document.getElementById('coment').value;
    const opcionElegida = document.querySelector('input[name="opcion"]:checked').value;

    let cantidad = parseInt(document.getElementById('cantidad').value);

    if (cantidad = 0) {
        cantidad = 1;
    }

    for (let i = 0; i < cantidad; i++) {
        // Mandamos los datos usando nuestra 'conexionBD'
        const { data, error } = await conexionBD
            .from('registro_pajas')
            .insert([
                {
                    id_user: nombreUsuario,
                    url: coment,
                    opcion: opcionElegida
                }
            ]);
        // Comprobamos si ha ido bien o mal
        if (error) {
            console.error("Error detallado:", error);
            alert("Pfff, ha habido un error al guardar: " + error.message);
        } else {
            document.getElementById('formulario-colegas').reset(); // Limpiamos el formulario
        }

        // Volvemos a poner el botón normal
        boton.innerText = "+1 Al Marcador";
    }
});