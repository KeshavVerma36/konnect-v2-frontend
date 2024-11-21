'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update with your server URL

export default function MainPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [friendInput, setFriendInput] = useState('');
  const [friends, setFriends] = useState([]);
  const [typingMessage, setTypingMessage] = useState(''); // To display typing notifications

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      fetchFriends(storedUsername); // Fetch friends when the component mounts
    } else {
      router.push('/login');
    }
  }, [router]);

  // Function to fetch friends
  const fetchFriends = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/friends?username=${username}`);
      const data = await response.json();
      if (response.ok) {
        setFriends(data.friends); // Update the friends state with the fetched data
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('typing', (username) => {
      setTypingMessage(`${username} is typing...`);
    });

    socket.on('stopTyping', () => {
      setTypingMessage('');
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/login');
  };

  const joinRoom = () => {
    if (roomCode) {
      socket.emit('joinRoom', { roomCode, username });
      setMessages([]); // Clear messages when joining a new room
    }
  };

  const sendMessage = () => {
    if (messageInput) {
      socket.emit('sendMessage', { roomCode, message: messageInput, username });
      setMessageInput('');
      socket.emit('stopTyping', { roomCode, username }); // Stop typing when the message is sent
    }
  };

  const addFriend = async () => {
    if (friendInput.trim()) {
      try {
        const response = await fetch('http://localhost:5000/api/addFriend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, friendUsername: friendInput.trim() }),
        });

        const data = await response.json();
        if (response.ok) {
          setFriends((prevFriends) => {
            const updatedFriends = [...prevFriends, friendInput.trim()];
            console.log('Updated Friends List:', updatedFriends); // Log the updated friends list
            return updatedFriends;
          });
          setFriendInput(''); // Clear the input after adding a friend
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error adding friend:', error);
        alert('Error adding friend');
      }
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Emit typing or stopTyping event based on the input
    if (e.target.value) {
      socket.emit('typing', { roomCode, username });
    } else {
      socket.emit('stopTyping', { roomCode, username });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-2/12 bg-black p-4 flex flex-col justify-between">
        <h1 className="text-white text-2xl mb-6 text-center">Welcome, {username}</h1>

        {/* Add friend */}
        <div>
          <label className="text-white">Add Friend</label><br />
          <input
            type="text"
            className="p-2 mt-2 text-black rounded w-full"
            placeholder="Enter friend's name"
            value={friendInput}
            onChange={(e) => setFriendInput(e.target.value)}
          />
          <button onClick={addFriend} className="bg-green-600 text-white p-2 rounded mt-2 w-full">
            Add Friend
          </button>

          {/* Friend list */}
          <div className="mt-6">
            <h2 className="text-white text-lg mb-2">Friends List</h2>
            <ul className="space-y-2">
              {friends.length > 0 ? (
                friends.map((friend, index) => (
                  <li key={index} className="p-2 bg-white rounded shadow">
                    {friend}
                  </li>
                ))
              ) : (
                <li className="text-white">No friends added yet</li>
              )}
            </ul>
          </div>
        </div>

        {/* Logout Button */}
        <button className="text-white bg-red-600 p-2 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-10/12 bg-pink-200 p-6 flex flex-col justify-between">
        {/* Room Code Input */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 mt-2 text-black rounded"
            placeholder="Enter Room Code..."
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button onClick={joinRoom} className="bg-blue-600 text-white p-2 rounded mt-2">
            Join Room
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-grow mb-4 border border-gray-400 p-2 rounded bg-white overflow-y-auto" style={{ height: '300px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`py-1 px-3 w-max rounded-lg m-2 shadow ${msg.includes(username) ? 'bg-blue-400 text-right ml-auto' : 'bg-green-400 text-left mr-auto'}`}
            >
              <p className="text-sm text-gray-300">{username}</p>
              <p className="text-white">{msg}</p>
            </div>
          ))}
        </div>

        {/* Typing Message */}
        {typingMessage && <div className="text-gray-500">{typingMessage}</div>}

        {/* Message Input */}
        <div className="flex">
          <input
            type="text"
            className="w-full p-2 text-black rounded"
            placeholder="Type your message..."
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
