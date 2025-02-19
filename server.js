require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_SECRET = process.env.GITHUB_SECRET || '';
const SCRIPT_PATH = process.env.SCRIPT_PATH || '';

// Middleware para capturar el raw body y verificar la firma
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

// Función para verificar la firma del webhook
function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Endpoint para el webhook
app.post('/webhook', (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send('Firma inválida');
  }

  const event = req.headers['x-github-event'];
  if (event === 'push') {
    // Ejecutar el script
    exec(`sh ${SCRIPT_PATH}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error ejecutando el script: ${err}`);
        return res.status(500).send('Error al ejecutar el script');
      }
      console.log(`Salida: ${stdout}`);
      res.status(200).send('Script ejecutado correctamente');
    });
  } else if (event === 'ping') {
    console.log('Ping recibido');
    console.log('payload:', req.body);
    res.status(200).send('pong');
  } else {
    res.status(200).send('Evento no manejado');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
