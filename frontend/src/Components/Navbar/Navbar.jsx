import React, { useEffect, useRef, useState } from 'react'
import logoImg from '../../images/logo.png';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';

const Navbar = (props) => {


    let admin = JSON.parse(localStorage.getItem('admin'));
    function handleLogout() {
        props.logOut();
        props.history.push('/SignIn');
    }

    return (
        <nav className='navbar position-fixed top-0 w-100 navbar-expand-lg navbar-light bg-light'>
            <div className="d-flex w-100 justify-content-around">
                <a className="navbar-brand" href="#">
                    <img src={logoImg} alt="Logo" width={75} height={60} />
                </a>
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
                        <li className="nav-item">
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/Home">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/Reports">Reports</NavLink>
                        </li>
                        {admin.role == 'manager' && <li className="nav-item">
                            <NavLink className="nav-link" to="/AdminControl">Admin Control</NavLink>
                        </li>
                        }
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
                                {admin && <span>Hello, {admin.full_name}</span>}

                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <NavLink className="dropdown-item" to="/UserInfo">View Profile</NavLink>
                                <NavLink className="dropdown-item" to="#">Settings</NavLink>
                                <div className="dropdown-divider"></div>
                                <p className="dropdown-item text-danger mb-0" onClick={handleLogout}>Logout</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;