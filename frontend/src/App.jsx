import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes, useHistory, Redirect } from 'react-router-dom';
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
import { } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

function App() {



  return (
    <Router>
      <div className="App">
        <Switch>

          <Route path='/SignIn' render={() => <SignIn />} />
          <Redirect from='/' exact to='/SignIn' />

          <Route>
            <ProtectedRoute component={Navbar} />
            <Switch>
  
              <ProtectedRoute path='/Home' component={Home} />
              <ProtectedRoute path='/UserInfo/:userId' component={UserInfo} />
              <ProtectedRoute path='/Reports' component={Reports} />
              <ProtectedRoute path='/AdminControl' component={AdminControl} />
              <ProtectedRoute path='/Users' component={Users} />
              <ProtectedRoute path='/Profile' component={Profile} />
              <ProtectedRoute path='/GovReports' component={GovReports} />
              <ProtectedRoute path='/GovUserControl' component={GovUserControl} />

            </Switch>
          </Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
