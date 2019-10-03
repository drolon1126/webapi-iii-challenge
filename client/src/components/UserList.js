import React, {useState,useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import UserCard from './UserCard';

const UserList = () =>{
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    axios
      .get('http://localhost:5000/api/users')
      .then(res=>setUsers(res.data))
      .catch(err=>console.log(err.response));
  },[]);

  return(
    <div>
      {users.map(user=>(
        <UserDetails key={user.id} user={user}/>
      ))}
    </div>
  );
}

function UserDetails({user}){
  return(
    <Link to={`/users/${user.id}`}>
      <UserCard user={user}/>
    </Link>
  );
}

export default UserList;