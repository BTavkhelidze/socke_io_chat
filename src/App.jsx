import { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';

const socket = io('http://localhost:3000');

function App() {
  const [inputVal, setInputVal] = useState('');
  const [recivedData, setRecivedData] = useState([]);
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showChat, setShowChat] = useState(false);

  const sendMessage = () => {
    const data = {
      author: userName,
      message: inputVal,
      roomId,
      time: new Date().toISOString(),
    };
    socket.emit('sendMessage', data);
    setInputVal('');
  };
  console.log(recivedData, 'recivedData');
  useEffect(() => {
    socket.on('sendMessage', (data) =>
      setRecivedData((prev) => [...prev, data])
    );
  }, [socket]);

  const joinNow = () => {
    if (roomId && userName) {
      socket.emit('joinRoom', roomId);
      setShowChat(true);
    }
  };

  return (
    <div>
      {showChat ? (
        <div>
          <input
            type='text'
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button onClick={sendMessage}>Send Message</button>

          {recivedData.map((el) => (
            <div key={el.time}>
              <h2>{el.message}</h2>
              <h5>{el.author}</h5>
              <h5>{el.time}</h5>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <input
            text='text'
            placeholder='username'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            text='text'
            placeholder='roomId'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinNow}>Join room</button>
        </div>
      )}
    </div>
  );
}

export default App;
