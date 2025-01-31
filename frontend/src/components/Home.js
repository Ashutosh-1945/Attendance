import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/user', { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch user data');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:3005/home', { withCredentials: true });
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (logout) {
      const handleLogout = async () => {
        try {
          await axios.post('http://localhost:3005/logout', {}, { withCredentials: true });
          navigate('/login');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

      handleLogout();
    }
  }, [logout]);

  const handleDeleteSubject = async (subjectId) => {
    try {
      await axios.delete(`http://localhost:3005/delete-subject/${subjectId}`, { withCredentials: true });
      setSubjects((prevSubjects) => prevSubjects.filter(subject => subject.subject_id !== subjectId));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleSaveSubject = async (subjectData) => {
    try {
      const response = await axios.post('http://localhost:3005/add-subject', subjectData, { withCredentials: true });
      setSubjects((prevSubjects) => [...prevSubjects, response.data.subject]);
    } catch (error) {
      console.error('Failed to add subject', error);
    }
  };

  const displayDetails = (id, subjectid) => {
    navigate(`/home/attendance/${id}/${subjectid}`);
  };

  return (
    <>
      <div className="home-header">
        <h1 className="home-title">Home Page</h1>
        {user ? (
          <p className="welcome-message">Welcome, {user.username}!</p>
        ) : (
          <p className="error-message">{error}</p>
        )}
      </div>

      <div className="subjects-section">
        <h1 className="subjects-title">Subjects</h1>
        <button className="add-subject-button" onClick={() => setShowModal(true)}>Add Subject</button>

        {showModal && (
          <Modal 
            onClose={() => setShowModal(false)} 
            onSave={handleSaveSubject} 
          />
        )}

        <div className="subject-cards-container">
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <div className="subject-card" key={index}>
                <h2 className="subject-name">{subject.subject_name}</h2>
                <p className="subject-code">Code: {subject.subject_code}</p>
                <button className="attendance-button" onClick={() => displayDetails(subject.user_id, subject.subject_id)}>Attendance</button>
                <button className="delete-button" onClick={() => handleDeleteSubject(subject.subject_id)}>Delete</button>
              </div>
            ))
          ) : (
            <p className="no-subjects-message">No subjects yet</p>
          )}
        </div>
      </div>

      <div className="logout-section">
        <button className="logout-button" onClick={() => setLogout(true)}>Logout</button>
      </div>
    </>
  );
}

export default Home;
