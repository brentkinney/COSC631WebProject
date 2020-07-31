import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';

function App() {
  return (
    <BrowserRouter>
    <Switch>
    <Redirect from="/" to="/auth" exact/>
    <Route path="/auth" component={AuthPage} />
    <Route path="/events" component={EventsPage} />    
    </Switch>
    </BrowserRouter>
  );
}

export default App;
