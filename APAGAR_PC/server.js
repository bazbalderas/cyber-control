// server.js - Servidor Node.js para control remoto de PCs
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Usuario y contraseñas (en una aplicación real, esto estaría en una base de datos segura)
const users = [
    { username: 'bazito', password: 'password1', pcAssigned: 'PC1' },
    { username: 'gabriel', password: 'password2', pcAssigned: 'PC2' },
    { username: 'jared', password: 'password3', pcAssigned: 'PC3' },
    { username: 'vasti', password: 'password4', pcAssigned: 'PC4' }
];

// Información de PCs (en una aplicación real, esto estaría en una base de datos)
const pcs = [
    { 
        id: 'PC1', 
        name: 'PC Bazito', 
        user: 'bazito', 
        ip: '134.209.75.146', 
        port: '2222',
        status: 'online' 
    },
    { 
        id: 'PC2', 
        name: 'PC Gabriel', 
        user: 'gabriel', 
        ip: '134.209.75.146', 
        port: '2223',
        status: 'online' 
    },
    { 
        id: 'PC3', 
        name: 'PC Jared', 
        user: 'jared', 
        ip: '134.209.75.146', 
        port: '2224',
        status: 'online' 
    },
    { 
        id: 'PC4', 
        name: 'PC Vasti', 
        user: 'vasti', 
        ip: '134.209.75.146', 
        port: '2225',
        status: 'online' 
    }
];

// Ruta para autenticación
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // No enviar la contraseña al cliente
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
});

// Ruta para obtener lista de PCs
app.get('/api/pcs', (req, res) => {
    res.json(pcs);
});

// Ruta para obtener estado de PCs (simulado)
app.get('/api/pcs/status', (req, res) => {
    // En una implementación real, aquí verificarías el estado real de cada PC
    res.json(pcs.map(pc => ({ id: pc.id, status: pc.status })));
});

// Ruta para apagar un PC específico
app.post('/api/shutdown/:pcId', (req, res) => {
    const { pcId } = req.params;
    const { username } = req.body;
    
    // Verificar permisos (usuario no puede apagar su propia PC)
    const user = users.find(u => u.username === username);
    if (!user || user.pcAssigned === pcId) {
        return res.status(403).json({ 
            success: false, 
            message: 'No tienes permiso para apagar esta PC' 
        });
    }
    
    // Buscar información del PC
    const pc = pcs.find(p => p.id === pcId);
    if (!pc) {
        return res.status(404).json({ 
            success: false, 
            message: 'PC no encontrada' 
        });
    }
    
    // Comando SSH para apagar remotamente (ajustar según el sistema operativo)
    // Para Linux/Ubuntu:
    const sshCommand = `ssh -p ${pc.port} ${pc.user}@${pc.ip} "sudo shutdown -h now"`;
    
    // Para Windows (requiere configuración adicional):
    // const sshCommand = `ssh ${pc.user}@${pc.ip} "shutdown /s /t 0"`;
    
    console.log(`Ejecutando comando: ${sshCommand}`);
    
    // Ejecutar comando de apagado
    exec(sshCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar comando: ${error}`);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al enviar comando de apagado', 
                error: stderr 
            });
        }
        
        // Actualizar estado en nuestra base de datos local
        const pcIndex = pcs.findIndex(p => p.id === pcId);
        if (pcIndex !== -1) {
            pcs[pcIndex].status = 'offline';
        }
        
        console.log(`Comando de apagado enviado exitosamente a ${pcId}`);
        res.json({ 
            success: true, 
            message: `Comando de apagado enviado exitosamente a ${pcId}`
        });
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});