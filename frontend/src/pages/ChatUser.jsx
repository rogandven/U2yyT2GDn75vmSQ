import { useState, useEffect} from 'react';
import { useAuth } from '@context/AuthContext';
import { io } from 'socket.io-client';
import { getMensajes } from '@services/chat.service.js';

export default function ChatUser() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conectado, setConectado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);

  // Conectar Socket.IO
  useEffect(() => {
    const newSocket = io('<http://localhost:5173>', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Conectado a Socket.IO');
      setConectado(true);

      // Unirse a la sala del profesor
      newSocket.emit('join-room', {
        userId: user.id,
        userType: 'profesor',
        userId2: user.id
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado');
      setConectado(false);
    });

    // Recibir mensajes en tiempo real
    newSocket.on('receive-message', (mensaje) => {
      setMensajes((prev) => {
        // Evitar duplicados
        const existe = prev.some(m => m.id_mensaje === mensaje.id_mensaje);
        if (existe) return prev;
        return [...prev, mensaje];
      });
    });

    // Indicador de escritura
    newSocket.on('user-typing', (data) => {
      if (data.tipo_usuario === 'admin') {
        setEscribiendo(true);
        setTimeout(() => setEscribiendo(false), 3000);
      }
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  // Cargar historial de mensajes
  useEffect(() => {
    const cargarMensajes = async () => {
      const result = await getMensajes(user.userId2);
      if (result.success) {
        setMensajes(result.data);
      }
    };
    cargarMensajes();
  }, [user.userId2]);

  // Enviar mensaje
  const handleEnviarMensaje = (e) => {
    e.preventDefault();

    if (!nuevoMensaje.trim() || !socket) return;

    socket.emit('send-message', {
      contenido: nuevoMensaje.trim(),
      tipo_usuario: 'profesor',
      id_usuario: user.id,
      id_profesor: user.id,
      idAdmin: 1,
    });

    setNuevoMensaje('');
  };

  // Indicar que está escribiendo
  const handleTyping = () => {
    if (!socket) return;
    socket.emit('typing', {
      tipo_usuario: 'profesor',
      idAdmin: 1,
    });
  };

  return (
    <div>
      <h1>Chat con Administración</h1>

      {/* Indicador de conexión */}
      <div style={{ color: conectado ? 'green' : 'red' }}>
        {conectado ? 'Conectado' : 'Desconectado'}
      </div>

      {/* Lista de mensajes */}
      <div>
        {mensajes.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.tipo_usuario === 'profesor' ? 'right' : 'left'
          }}>
            <strong>{msg.tipo_usuario === 'admin' ? 'Admin' : 'Tú'}:</strong>
            <p>{msg.contenido}</p>
          </div>
        ))}

        {escribiendo && <p>Administrador está escribiendo...</p>}
      </div>

      {/* Formulario de envío */}
      <form onSubmit={handleEnviarMensaje}>
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Escribe un mensaje..."
          disabled={!conectado}
        />
        <button type="submit" disabled={!conectado}>
          Enviar
        </button>
      </form>
    </div>
  );
}
