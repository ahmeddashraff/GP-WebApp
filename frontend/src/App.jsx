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
import Users from './Components/Users/Users';
import Profile from './Components/Profile/Profile';
import GovReports from './Components/GovReports/GovReports';
import GovUserControl from './Components/GovUserControl/GovUserControl';

function App() {
  let history = useHistory();

  // let [loginAdmin, setLoginAdmin] = useState(null);


  // function getAdminInfo() {
  //   let admin = localStorage.getItem('admin') || localStorage.getItem('gov_user');
  //   setLoginAdmin(JSON.parse(admin));
  // }


  // useEffect(() => {

  //   if (localStorage.getItem('admin') || localStorage.getItem('gov_user') ) {
  //     getAdminInfo();
  //   }
  // }, []);




  return (
    <Router>
      <div className="App">
        <Switch>

          <Route path='/SignIn' render={(props) => <SignIn />} />
          <Route>
            <Route render={() => <Navbar />} />
            <Switch>
              <Route path='/Home'>
                <Home />
              </Route>
              <Route path='/UserInfo/:userId'>
                <UserInfo />
              </Route>
              <Route path='/Reports' render={(props) => <Reports  />} />
              <Route path='/AdminControl' render={() => <AdminControl />} />
              <Route path='/Users' render={() => <Users />} />
              <Route path='/Profile' render={() => <Profile />} />
              <Route path='/GovReports' render={() => <GovReports />} />
              <Route path='/GovUserControl' render={() => <GovUserControl />} />
            </Switch>
          </Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
