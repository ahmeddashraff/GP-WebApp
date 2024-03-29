import React, { useEffect, useRef, useState } from 'react'
import logoImg from '../../images/logo.png';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import { myGlobalVariable } from '../../globalVariables.js';

const Navbar = (props) => {

    let history = useHistory();

    let admin = JSON.parse(sessionStorage.getItem('admin'));
    function handleLogout() {
        logOut();
        history.push('/SignIn');
    }

    async function logOut() {
        if (sessionStorage.getItem('admin')) {
            const config = {
                headers: {
                    Authorization: admin.token,
                    'Content-Type': 'application/json',
                },
            };
            let { data } = await axios.post(`http://${myGlobalVariable}/api/${admin.isGovUser ? 'GovUsers' : (admin.role == 'owner' ? 'owner':'admins')}/logout-current`, {}, config)
            sessionStorage.removeItem('admin');
        }
    }

    return (
        <nav className='navbar position-fixed top-0 w-100 navbar-expand-lg navbar-light bg-light'>
            <div className="d-flex w-100 justify-content-around">
                <NavLink className="navbar-brand" to={!admin.isGovUser ? "/Home" : "/GovReports"}>
                    <img src={logoImg} alt="Logo" width={75} height={60} />
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse align-items-center justify-content-end" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        {admin.role == 'owner' ? <li className="nav-item">
                            <NavLink className="nav-link" to="/Owner">Managers</NavLink>
                        </li> : <>
                            {!admin.isGovUser && <li className="nav-item">
                                <NavLink className="nav-link" to="/Home">Home</NavLink>
                            </li>}

                            <li className="nav-item">
                                <NavLink className="nav-link" to={!admin.isGovUser ? "/Reports" : "/GovReports"}>Reports</NavLink>
                            </li>
                            {!admin.isGovUser && <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/Users">Users</NavLink>
                                </li>
                                {admin.role == 'manager' && <li className="nav-item">
                                    <NavLink className="nav-link" to="/AdminControl">Admin Control</NavLink>
                                </li>
                                }
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/GovUserControl">Gov User Control</NavLink>
                                </li></>
                            }</>}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdownMenuLink"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <span>Hello, {admin.full_name}</span>

                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                {admin.role !== 'owner' && <><NavLink className="dropdown-item" to="/Profile">View Profile</NavLink>
                                <div className="dropdown-divider"></div></>}
                                <p className="dropdown-item text-danger mb-0 cursor-pointer" onClick={handleLogout}>Logout</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav >
    );
}

export default Navbar;