import { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';

const socket = io('http://localhost:3000');

function App() {
  const [inputVal, setInputVal] = useState('');
  const [recivedData, setRecivedData] = useState([]);

  const sendMessage = () => {
    socket.emit('sendMessage', { message: inputVal });
    setInputVal('');
  };
  console.log(recivedData, 'recivedData');
  useEffect(() => {
    socket.on('sendMessage', (data) =>
      setRecivedData((prev) => [...prev, data])
    );
  }, [socket]);

  return (
    <>
      <div>
        <input
          type='text'
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>

        {recivedData.map((el, i) => (
          <p key={i}>{el.message}</p>
        ))}
      </div>
    </>
  );
}

export default App;
