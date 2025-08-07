import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const response = await axios.post('http://localhost:8000/api/login' , {
      withCredentials: true ,
      username,
      password,
    });

    if (response.data.status) {
      const token = response.data.token;
      
      if (token) {
        localStorage.setItem('auth_token', token);
        console.log('Token stored:', token);
      } else {
        console.log('No token in response');
      }

      setMessage('Login successful!');
    }
  } catch (error) {
    console.error(error);
    setMessage('Login failed: ' + (error.response?.data?.message || 'Server error'));
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
