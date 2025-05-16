import { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';

const socket = io('http://localhost:3000');

function App() {
  const [inputVal, setInputVal] = useState('');
  const [recivedData, setRecivedData] = useState([]);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const sendMessage = () => {
    // setClicked(true)
    const data = {
      author: userName,
      message: inputVal,
      roomId,
      time: new Date().toISOString(),
    };
    socket.emit('sendMessage', data);
    setInputVal('');
  };
  useEffect(() => {
    const messageHandler = (data) => {
      setRecivedData((prev) => [...prev, data]);
    };

    socket.on('sendMessage', messageHandler);
    socket.on('joinRoom', (data) => setAllUsers(data));

    return () => {
      socket.off('sendMessage', messageHandler);
      socket.off('joinRoom');
    };
  }, []);

  const joinNow = () => {
    const data = {
      roomId,
      userName,
    };
    if (roomId && userName) {
      socket.emit('joinRoom', data);

      setShowChat(true);
    }
  };

  console.log(allUsers, 'setAllUsers');
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
          {userName && (
            <p>
              user <span className='userName'>{userName}</span> connected
            </p>
          )}
          {allUsers && (
            <div>
              {allUsers.map((el) => (
                <p key={el}>{el}</p>
              ))}
            </div>
          )}
          {/* {user && <p>{user} connected</p>} */}
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
