const axios = require('axios');
const CONFIG = require('./config');

/**
 * Función para enviar un mensaje de prueba (Plantilla hello_world)
 * @param {string} numeroDestino - El número con código de país (ej: +5493496460324)
 */
async function enviarMensajePrueba(numeroDestino) {
    const url = `${CONFIG.BASE_URL}/${CONFIG.VERSION}/${CONFIG.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: "whatsapp",
        to: numeroDestino,
        type: "template",
        template: {
            name: "hello_world",
            language: {
                code: "en_US"
            }
        }
    };

    const headers = {
        'Authorization': `Bearer ${CONFIG.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        console.log(`Enviando mensaje a ${numeroDestino}...`);
        const response = await axios.post(url, data, { headers });

        console.log('✅ ¡Mensaje enviado con éxito!');
        console.log('ID del mensaje:', response.data.messages[0].id);

    } catch (error) {
        console.error('❌ Error al enviar el mensaje:');
        if (error.response) {
            // Error de respuesta de la API de Meta
            console.error('Status:', error.response.status);
            console.error('Detalle:', JSON.stringify(error.response.data, null, 2));
        } else {
            // Error de conexión u otros
            console.error('Mensaje:', error.message);
        }
    }
}

// Ejecución (Asegúrate de cambiar el número por el tuyo verificado en el panel)
// Formato para Argentina: 54 + 9 + código de área (sin 0) + número (sin 15)
// Ejemplo: 54 9 3496 460324
const MI_NUMERO = '543496460324';
enviarMensajePrueba(MI_NUMERO);
