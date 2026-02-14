
// 1. PON AQUÍ TUS CLAVES DE SUPABASE
const SUPABASE_URL = 'https://vkjcfhxxmtmlgynmtpby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GfGmOiq3CazPywMtfh4xNA_R335BXeT';

// 2. Inicializamos la conexión
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Le decimos al botón qué hacer cuando alguien envíe el formulario
document.getElementById('formulario-colegas').addEventListener('submit', async function (evento) {
    // Esto evita que la página parpadee o se recargue al darle al botón
    evento.preventDefault();

    // Cambiamos el texto del botón para que parezca que está cargando
    const boton = document.getElementById('sumar');
    boton.innerText = "Enviando...";

    // Recogemos los datos que ha escrito el colega en la web
    const nombreUsuario = document.getElementById('name').value;
    const urlVideo = document.getElementById('url').value;
    const opcionElegida = document.querySelector('input[name="opcion"]:checked').value;

    // Mandamos los datos a tu tabla 'registro_pajas'
    // (Acuérdate de que 'momento' se pone solo con la hora del servidor)
    const { data, error } = await supabase
        .from('registro_pajas')
        .insert([
            {
                id_user: nombreUsuario,
                url: urlVideo,
                opcion: opcionElegida
            }
        ]);

    // Comprobamos si ha ido bien o mal
    if (error) {
        console.error(error);
        alert("Pfff, ha habido un error al guardar: " + error.message);
    } else {
        alert("¡Anotado en el marcador! 💦");
        document.getElementById('formulario-colegas').reset(); // Limpiamos el formulario
    }

    // Volvemos a poner el botón normal
    boton.innerText = "+1 Al Marcador";
});