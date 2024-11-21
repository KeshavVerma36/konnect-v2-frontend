'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from 'next/navigation'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize router

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        // If response is not ok, throw an error to handle it
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }

      const data = await response.json(); // This will work only if response is okay
      alert('Signup successful!');
      router.push('/login'); // Navigate to the login page
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred: ' + error.message); // Show the error message
    }
  };

  return (
    <div className="bg-stone-950 flex justify-center items-center h-screen">
      <div className="p-8 rounded-lg" style={{ backgroundColor: '#2B2B2B' }}>
        <p className="text-white text-center text-5xl mb-8">KonnecT</p>
        <div className="mb-5">
          <label className="text-xl" style={{ color: '#B0B0B0' }}>Username:</label>
          <input
            className="w-full mt-2 p-2 rounded-md text-white text-xl focus:outline-none"
            style={{ backgroundColor: '#B0B0B0' }}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label className="text-xl" style={{ color: '#B0B0B0' }}>Email:</label>
          <input
            className="w-full mt-2 p-2 rounded-md text-white text-xl focus:outline-none"
            style={{ backgroundColor: '#B0B0B0' }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-5 relative">
          <label className="text-xl" style={{ color: '#B0B0B0' }}>Password:</label>
          <input
            className="w-full mt-2 p-2 rounded-md text-white text-xl focus:outline-none"
            style={{ backgroundColor: '#B0B0B0' }}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-12 cursor-pointer text-xl"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? '-' : '+'}
          </span>
        </div>
        <div className="flex justify-center mt-12">
          <button 
            onClick={handleSignup} 
            className="bg-white text-gray-800 w-full py-2 rounded-full text-lg font-semibold hover:bg-gray-300"
          >
            Sign Up
          </button>
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-400 text-md">
            Already have an account? <a href="/login" className="text-white">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
