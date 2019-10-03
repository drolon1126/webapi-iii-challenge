import React, {useState,useEffect} from 'react';
import axios from "axios";

const User = props => {
  const [user,setUser] = useState({});
  const [posts,setPosts] = useState([]);

  useEffect(()=>{
    axios
      .get(`http://localhost:5000/api/users/${props.match.params.id}`)
      .then(res=>setUser(res.data))
      .catch(err=>console.log(err.response));
    axios
      .get(`http://localhost:5000/api/users/${props.match.params.id}/posts`)
      .then(res=>setPosts(res.data))
      .catch(err=>console.log(err.response));
  },[]);

  return (
    <div className="user-card">
      <h2>{user.name}</h2>

      {posts.map(post => (
        <div key={post.id} className="post">
          {post.text}
        </div>
      ))}

    </div>
  );
};

export default User;
