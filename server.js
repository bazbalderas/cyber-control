// Importamos Express y creamos una instancia de la aplicación
const express = require('express');
const app = express();
const port = 3000;

// Usamos un array para simular las 4 PCs
let pcs = [
  { id: 1, status: 'activo' },
  { id: 2, status: 'activo' },
  { id: 3, status: 'activo' },
  { id: 4, status: 'activo' }
];

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Ruta para obtener el estado de las PCs
app.get('/api/pcs', (req, res) => {
  res.json(pcs);
});

// Ruta para apagar una PC (cambiar su estado)
app.post('/api/apagar/:id', (req, res) => {
  const pcId = parseInt(req.params.id);
  const pc = pcs.find(p => p.id === pcId);

  if (pc) {
    pc.status = 'apagado';  // Cambiamos el estado de la PC a "apagado"
    res.json({ message: `La PC ${pcId} ha sido apagada.` });
  } else {
    res.status(404).json({ message: `PC con id ${pcId} no encontrada.` });
  }
});

// Ruta para encender una PC (cambiar su estado)
app.post('/api/encender/:id', (req, res) => {
  const pcId = parseInt(req.params.id);
  const pc = pcs.find(p => p.id === pcId);

  if (pc) {
    pc.status = 'activo';  // Cambiamos el estado de la PC a "activo"
    res.json({ message: `La PC ${pcId} ha sido encendida.` });
  } else {
    res.status(404).json({ message: `PC con id ${pcId} no encontrada.` });
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
