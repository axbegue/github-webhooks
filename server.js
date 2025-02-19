require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_SECRET = process.env.GITHUB_SECRET || '';

const API_REPO_NAME = process.env.API_REPO_NAME || '';
const API_SCRIPT_PATH = process.env.API_SCRIPT_PATH || '';

const FRONT_REPO_NAME = process.env.FRONT_REPO_NAME || '';
const FRONT_SCRIPT_PATH = process.env.FRONT_SCRIPT_PATH || '';

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

// Función para ejecutar el script correspondiente
function runScript(scriptPath, res) {
  // Ejecutar el script
  exec(`sh ${scriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error ejecutando el script ${scriptPath}: ${err.message}`);
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`✅ Script ${scriptPath} ejecutado correctamente.`);
    console.log(`stdout: ${stdout}`);
  });
}

// Endpoint para el webhook
app.post('/webhook', (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send('Firma inválida');
  }

  const event = req.headers['x-github-event'];

  if (event === 'ping') {
    console.log('Ping recibido');
    return res.status(200).send('pong');
  }

  if (event === 'push') {
    const repoName = req.body.repository?.name;
    const branchRef = req.body.ref; // e.g., refs/heads/master
    const branch = branchRef.split('/').pop(); // e.g., master

    console.log(`Push recibido desde el repositorio: ${repoName} en ${branch}`);

    // Verificar si el push es en la rama master
    if (branch !== 'master') {
      console.log(`⚠️ Push ignorado: no es en la rama master (${branch})`);
      return res.status(200).send(`Push ignorado. Rama: ${branch}`);
    }

    if (repoName === API_REPO_NAME) {
      console.log('Ejecutando script para API...');
      res.status(200).send('Ejecución de script iniciada');
      return runScript(API_SCRIPT_PATH, res);
    }

    if (repoName === FRONT_REPO_NAME) {
      console.log('Ejecutando script para Frontend...');
      res.status(200).send('Ejecución de script iniciada');
      return runScript(FRONT_SCRIPT_PATH, res);
    }

    console.log('Repositorio no reconocido');
    return res.status(400).send('Repositorio no reconocido');
  }

  res.status(200).send(`Evento ${event} no manejado`);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
