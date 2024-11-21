'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Change import

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the token and username in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username); // Save the username
        alert('Login successful!');
        // Redirect to the main page
        router.push('/mainpage');
      } else {
        alert(data.message); // Handle error
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-stone-950 flex justify-center items-center h-screen">
      <div className="p-8 rounded-lg" style={{ backgroundColor: '#2B2B2B' }}>
        <p className="text-white text-center text-5xl mb-8">KonnecT</p>
        <div className="mb-5">
          <label className="text-lg" style={{ color: '#B0B0B0' }}>Username:</label>
          <input
            className="w-full mt-2 p-2 rounded-md text-white text-xl focus:outline-none"
            style={{ backgroundColor: '#B0B0B0' }}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-5 relative"> {/* Make this a relative container */}
          <label className="text-lg" style={{ color: '#B0B0B0' }}>Password:</label>
          <input
            className="w-full mt-2 p-2 rounded-md text-white text-xl focus:outline-none"
            style={{ backgroundColor: '#B0B0B0' }}
            type={showPassword ? 'text' : 'password'} // Update the type based on showPassword state
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Capture password input
          />
          <span
            className="absolute right-3 top-12 cursor-pointer text-xl"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? '-' : '+  '}
          </span>
        </div>
        <div className="flex justify-center mt-12">
          <button 
            onClick={handleLogin} 
            className="bg-white text-gray-800 w-full py-2 rounded-full text-lg font-semibold hover:bg-gray-300"
          >
            Login
          </button>
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-400 text-md">
            Don’t have an account? <a href="/signup" className="text-white">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
