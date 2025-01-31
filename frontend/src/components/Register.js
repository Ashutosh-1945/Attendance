// import React, { useState } from 'react';
// import axios from 'axios';

// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleRegister = async () => {

//     if (password !== confirmPassword) {
//       setMessage('Passwords do not match');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:3005/register', {
//         username,
//         email,
//         password,
//       });

//       if(response.status===201){
//         alert('Succesful Registration');
//         navigate('/login');
//       }

//       setMessage(response.data.message);
//       setUsername('');
//       setEmail('');
//       setPassword('');
//       setConfirmPassword('');
//     } catch (error) {
//       console.log(error)
//       setMessage(error.response?.data?.error || 'Registration failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//       />
//       <button onClick={handleRegister}>Register</button>
//       <p>{message}</p>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3005/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        alert('Successful Registration');
        navigate('/login');
      }

      setMessage(response.data.message);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="register-input"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="register-input"
      />
      <button onClick={handleRegister} className="register-button">Register</button>
      <p className="register-message">{message}</p>
    </div>
  );
}

export default Register;

