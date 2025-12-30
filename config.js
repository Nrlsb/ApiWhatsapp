// =================================================================
// CONFIGURACIÓN GLOBAL DE WHATSAPP API (NODE.JS)
// =================================================================

// Cargar variables de entorno
require('dotenv').config();

const CONFIG = {
    // Access Token
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,

    // Phone Number ID
    PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,

    // Versión de la API
    VERSION: process.env.VERSION || 'v21.0',

    // URL Base
    BASE_URL: process.env.BASE_URL || 'https://graph.facebook.com',

    // Token de verificación para el Webhook
    WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN
};

module.exports = CONFIG;
