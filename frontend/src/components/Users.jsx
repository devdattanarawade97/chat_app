// client/src/components/Users.js
import React from "react";

const Users = ({ users, onUserClick }) => {
  return (
    <div className="users-list">
      <h3>Online Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onUserClick(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
