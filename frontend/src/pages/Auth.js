import React, { Component } from 'react';
import './Auth.css';

class AuthPage extends Component {
    state = {
        isLogin: true
    };
    constructor(props) {
        super(props);
        this.emailElement = React.createRef();
        this.passwordElement = React.createRef();
    }

    switchMode = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        })
    };

    submitForm = event => {
        event.preventDefault();
        const email = this.emailElement.current.value;
        const password = this.passwordElement.current.value;
        if(email.trim().length === 0 || password.trim().length ===0) {
            return;
        }
        let request = {
            query: `
            query {
                login(email: "${email}", password: "${password}") {
                    userId
                    token
                    tokenExpiration
                }
            }
            `
        };

        if (!this.state.isLogin) {
            request = {
                query: `
                    mutation {
                        createUser(userInput: {email: "${email}", password: "${password}"}) {
                            _id
                            email
                        }
                    }
                `
            };
        }
        
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Request Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
        })
        .catch(err => {
            console.log(err);
        });
    };
    
    render() {
        return <form className="AuthForm" onSubmit={this.submitForm}>
            <div className="AuthFormItems">
                <label htmlFor="email">E-Mail</label>
                <input type="email" id="email" ref={this.emailElement} />                
            </div>
            <div className="AuthFormItems">              
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordElement} />
            </div>
            <div className="AuthFormButtons">               
                <button type="submit">Submit</button>
                <button type="button" onClick={this.switchMode}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
            </div>
        </form>;
    }
}

export default AuthPage;