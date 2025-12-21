"use strict"
import cors from "cors";
import express from "express";
import morgan from "morgan";
import indexRoutes from "./src/routes/index.routes.js";
import { PORT, HOST } from "./src/config/configEnv.js";
import { connectDB } from "./src/config/configDb.js";
import { createElectivos, createUsers } from "./src/config/initDb.js";
import {createServer} from "http";
import { Server } from 'socket.io';


async function setupServer() {
  // Crea la instancia de Express
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
  cors: {
    origin: "<http://localhost:3001>",
    methods: ["GET", "POST"],
    credentials: true
  }
});
  app.disable("x-powered-by");
  

  // Habilita el CORS para permitir solicitudes desde otros dominios (frontend)
  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );

  // Avisa a express que use JSON
  app.use(express.json());

  // Configura el middleware de morgan para registrar las peticiones HTTP
  app.use(morgan("dev"));

  // Configura las rutas de la API
  app.use("/api", indexRoutes);

  // Configuración de Socket.IO
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

  // Usuario se une a una sala
  socket.on('join-room', (data) => {
    const { userId, userType } = data;
    const roomName = userType === 'admin'
      ? `admin-${userId}`
      : `profesor-${userId}`;

    socket.join(roomName);
    console.log(`Usuario ${userId} (${userType}) se unió a la sala: ${roomName}`);
  });

  // Enviar mensaje
  socket.on('send-message', async (data) => {
    try {
      // Guardar mensaje en BD
      const nuevoMensaje = await MensajeService.createMensaje(data);

      // Determinar salas destino
      const roomAdmin = `admin-${data.idAdmin || 1}`;
      const roomProfesor = `profesor-${data.userId}`;

      // Emitir a ambas salas (admin y profesor)
      io.to(roomAdmin).to(roomProfesor).emit('receive-message', nuevoMensaje);

      console.log('Mensaje enviado a salas:', roomAdmin, roomProfesor);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      socket.emit('error', { message: 'Error al enviar mensaje' });
    }
  });

  // Indicador de escritura
  socket.on('typing', (data) => {
    const { tipo_usuario, idUser, idAdmin } = data;
    const targetRoom = tipo_usuario === 'admin'
      ? `profesor-${idUser}`
      : `admin-${idAdmin || 1}`;

    socket.to(targetRoom).emit('user-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});
// Iniciar servidor con Socket.IO backend 3000 socket.io 3001 80 de 4 backend
  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Socket.IO habilitado en <http://localhost>:${PORT}`);
  });
  

  // Enciende el servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${HOST}:${PORT}`);
  });
}

// Función para configurar la API
async function setupAPI() {
  try {
    // Conecta la base de datos
    await connectDB();
    // Crea los usuarios iniciales
    await createUsers();
    await createElectivos();
    // Configura el servidor
    await setupServer();
  } catch (error) {
    console.error("Error en index.js -> setupAPI(): ", error);
  }
}

// Inicia la configuración de la API
setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI(): ", error));
