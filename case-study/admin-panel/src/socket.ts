import { io } from 'socket.io-client';

const getSocket = () => {
  const token = localStorage.getItem('token');
  return io('http://localhost:4000', {
    auth: {
      token: token
    }
  });
};

const socket = getSocket();

export default socket;
