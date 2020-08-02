import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navBar = props => (
    <header className="NavBarHeader">
        <div className="NavBar">
            <h1>Event Booker</h1>
        </div>
        <nav className="NavItems">
            <ul>
                <li><NavLink to="/events">Events</NavLink></li>
                <li><NavLink to="/auth">Authentication</NavLink></li>
            </ul>
        </nav>
    </header>
);

export default navBar;