
/*import { Routes,Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Nomatch from './components/Nomatch';
import Home from './components/Home';
import Attendance from './components/Attendance';

import './App.css';

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/attendance/:userId/:subjectId" element={<Attendance />} />  
          
      </Routes>
    </>
  );
}

export default App;
*/

// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Attendance from './components/Attendance';
import Nomatch from './components/Nomatch';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Private Routes */}
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/home/attendance/:userId/:subjectId" element={<PrivateRoute element={<Attendance />} />} />

        {/* Catch-all route */}
        <Route path="*" element={<Nomatch />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;




