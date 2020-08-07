import React, { Component } from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/authContext';
import EventList from '../components/EventList/EventList';

class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
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

        //const event = {title, description, price, hours, date};
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
            this.setState(prevState =>{
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    price: resData.data.createEvent.price,
                    hours: resData.data.createEvent.hours,
                    date: resData.data.createEvent.date,
                    createdBy: {
                        _id: this.context.userId                    
                    }
                });
                return {events: updatedEvents};
            });
        })
        .catch(err => {
            console.log(err);
        });
    };

    modalCancel = () => {
        this.setState({creating: false, selectedEvent: null});
    };

    fetchEvents () {
        this.setState({isLoading:true})
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
            this.setState({events: events, isLoading: false});
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    }

    showDetail = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return {selectedEvent: selectedEvent};
        });
    }

    deleteEvent  = () => {}

    editEvent  = () => {} //comment added to test azure deploy

    render() {        
        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop/>}
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
                    {this.state.selectedEvent && (<Modal title={this.state.selectedEvent.title} canCancel 
                    onCancel={this.modalCancel}>
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>{this.state.selectedEvent.hours}hrs - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                    <h2>${this.state.selectedEvent.price}</h2>
                    <p>{this.state.selectedEvent.description}</p>
                    </Modal>)}    
                <div className="EventsPage">
                <p>Create a new Event!</p>  
                    <button className="btn" onClick={this.startCreateEvent}>Create Event</button>
                </div>
                {this.state.isLoading ? 
                <div className="Spinner"><div className="lds-dual-ring"></div></div> :  
                <EventList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.showDetail}/>}
                          
            </React.Fragment>
        );
    }
}

export default EventsPage;