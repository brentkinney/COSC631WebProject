import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import NavBar from './components/Navbar';
import AuthContext from './context/authContext';

class App extends Component {
  state = {
    token: null,
    userId: null
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({token: null, userId: null})
  }

  render() {
  return (
    <BrowserRouter>
    <React.Fragment>
      <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout:this.logout}}>
    <NavBar />
    <main className="PageContent">
    <Switch>
    {!this.state.token && <Redirect from="/" to="/auth" exact/>}
    {!this.state.token && <Redirect from="/events" to="/auth" exact/>}
    {this.state.token && <Redirect from="/" to="/events" exact/>}
    {this.state.token && <Redirect from="/auth" to="/events" exact/>}
    {!this.state.token && <Route path="/auth" component={AuthPage} />}
    {this.state.token && <Route path="/events" component={EventsPage} />}
    </Switch>
    </main>
    </AuthContext.Provider>
    </React.Fragment>
    </BrowserRouter>
  );
}}

export default App;
