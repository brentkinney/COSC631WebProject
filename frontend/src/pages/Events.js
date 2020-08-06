import React, { Component } from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/authContext';

class EventsPage extends Component {
    state = {
        creating: false,
        events: []
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElement = React.createRef();
        this.descriptionElement = React.createRef();
        this.priceElement = React.createRef();
        this.hoursElement = React.createRef();
        this.dateElement = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEvent = () => {
        this.setState({creating:true});
    }

    modalConfirm = () => {
        this.setState({creating: false});
        const title = this.titleElement.current.value;
        const description = this.descriptionElement.current.value;
        const price = +this.priceElement.current.value;
        const hours = +this.hoursElement.current.value;
        const date = this.dateElement.current.value;

        if(title.trim().length ===0 || price <= 0 || hours <= 0 || date.trim().length ===0 || description.trim().length===0) {
            return;
        }

        const event = {title, description, price, hours, date};
        const request = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, hours: ${hours}, date: "${date}"}) {
                        _id
                        title
                        description
                        price
                        hours
                        date
                        createdBy {
                            _id
                            email
                        }
                    }
                }
            `
        };

       const token = this.context.token;
        
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
            this.fetchEvents();
        })
        .catch(err => {
            console.log(err);
        });
    };

    modalCancel = () => {
        this.setState({creating: false});
    };

    fetchEvents () {
        const request = {
            query: `
                query {
                   events {
                        _id
                        title
                        description
                        price
                        hours
                        date
                        createdBy {
                            _id
                            email
                        }
                    }
                }
            `
        };

       const token = this.context.token;
        
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Request Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const events = resData.data.events;
            this.setState({events: events});
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const eventList = this.state.events.map(event => {
        return <li key={event._id} className="EventsListItems">{event.title}</li>;
        });
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancel} onConfirm={this.modalConfirm}>
                    <form>
                        <div className="FormItems">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElement}></input>
                        </div>
                        <div className="FormItems">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceElement}></input>
                        </div>
                        <div className="FormItems">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateElement}></input>
                        </div>
                        <div className="FormItems">
                            <label htmlFor="hours">Hours</label>
                            <input type="number" id="hours" ref={this.hoursElement}></input>
                        </div>
                        <div className="FormItems">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" rows="4" ref={this.descriptionElement}/>
                        </div>
                    </form>
                    </Modal>}      
                <div className="EventsPage">
                <p>Create a new Event!</p>  
                    <button className="btn" onClick={this.startCreateEvent}>Create Event</button>
                </div>
                <ul className="EventsList">{eventList}</ul>             
            </React.Fragment>
        );
    }
}

export default EventsPage;