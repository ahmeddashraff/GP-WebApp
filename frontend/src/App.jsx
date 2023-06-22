import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes, useHistory } from 'react-router-dom';
// import { Redirect, Route, Switch, useHistory, Routes } from "react-router";


import SignIn from './Components/SignIn/SignIn';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import UserInfo from './Components/UserInfo/UserInfo';
import Reports from './Components/Reports/Reports';
import AdminControl from './Components/AdminControl/AdminControl';

function App() {
  let history = useHistory();

  let [loginAdmin, setLoginAdmin] = useState(null);


  function getAdminInfo() {
    let admin = localStorage.getItem('admin');
    setLoginAdmin(JSON.parse(admin));
  }

  function logOut() {
    localStorage.removeItem('admin');
    setLoginAdmin(null);
  }

  useEffect(() => {

    if (localStorage.getItem('admin')) {
      getAdminInfo();
    }
  }, []);




  return (
    <Router>
      <div className="App">
        <Switch>

          <Route path='/SignIn' render={(props) => <SignIn {...props} onLogin={getAdminInfo} />} />
          <Route>
            <Route render={(props) => <Navbar {...props} loginAdmin={loginAdmin} getAdminInfo={getAdminInfo} logOut={logOut} />} />
            <Switch>
              <Route path='/Home'>
                <Home />
              </Route>
              <Route path='/UserInfo/:userId'>
                <UserInfo />
              </Route>
              <Route path='/Reports' render={(props) => <Reports {...props} loginAdmin={loginAdmin} />} />
              <Route path='/AdminControl' render={() => <AdminControl  loginAdmin={loginAdmin} />} />
            </Switch>
          </Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
