import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import NavBar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
    <React.Fragment>
    <NavBar />
    <main className="PageContent">
    <Switch>
    <Redirect from="/" to="/auth" exact/>
    <Route path="/auth" component={AuthPage} />
    <Route path="/events" component={EventsPage} />    
    </Switch>
    </main>
    </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
