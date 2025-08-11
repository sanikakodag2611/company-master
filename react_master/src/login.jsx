import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username,
        password,
      });

      if (response.data.status) {
        const token = response.data.token;

        if (token) {
          localStorage.setItem('auth_token', token);
          setIsLoggedIn(true);              // <-- update app login state
          navigate('/add-employee');        // <-- redirect after login
        } else {
          setMessage('No token received from server.');
        }
      } else {
        setMessage('Login failed: ' + (response.data.message || 'Unknown error'));
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
          required
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
