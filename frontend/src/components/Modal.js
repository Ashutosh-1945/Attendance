import React, { useState } from 'react';

function Modal({ onClose, onSave, onDelete }) {
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');

  const handleSave = () => {
    onSave({ subjectCode, subjectName });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Subject</h2>
        <label>
          Subject Code:
          <input 
            type="text" 
            value={subjectCode} 
            onChange={(e) => setSubjectCode(e.target.value)} 
          />
        </label>
        <label>
          Subject Name:
          <input 
            type="text" 
            value={subjectName} 
            onChange={(e) => setSubjectName(e.target.value)} 
          />
        </label>
        
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDelete} className="delete-button">Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default Modal;
