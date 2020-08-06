import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import AuthContext from '../context/authContext';

const navBar = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
    <header className="NavBarHeader">
        <div className="NavBar">
            <h1>Extreme Jeep Mods Service Events</h1>
        </div>
        <nav className="NavItems">
            <ul>
                {context.token && ( <React.Fragment><li><NavLink to="/events">Events</NavLink></li><li><button onClick={context.logout}>Logout</button></li></React.Fragment>)}
                {!context.token && <li><NavLink to="/auth">Authentication</NavLink></li>}
            </ul>
        </nav>
    </header>
    )}}
    </AuthContext.Consumer>
);

export default navBar;