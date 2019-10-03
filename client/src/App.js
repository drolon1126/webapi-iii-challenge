import React from "react";
import { Route } from "react-router-dom";
import UserList from "./components/UserList";
import User from "./components/User";
import './App.css';

const App = () => {

  return (
    <div className="App">
      <Route exact path='/' component={UserList}/>
      <Route path='/users/:id' component={User}/>
    </div>
  );
}

export default App;
