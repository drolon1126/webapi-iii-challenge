import React from 'react';

const UserCard = props => {
  const { name, id } = props.user;
  return (
    <div className="user-card">
      <h2>{name}</h2>
    </div>
  );
};

export default UserCard;
