// src/Card.js

import React, { useState } from "react";
// Import CSS for styling

const Card = ({ title, content, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="card-title">{title}</h2>
      <p className="card-content">{content}</p>
      {isHovered && (
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

export default Card;
