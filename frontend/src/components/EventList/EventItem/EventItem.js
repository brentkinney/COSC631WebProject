import React from 'react';
import './EventItem.css';

const eventItem = props => (
    <li key={props.eventId} className="EventsListItems">
        <React.Fragment>
        <div>
            <h1>{props.title}</h1>
            <h2>{props.hours}hrs - {new Date(props.date).toLocaleDateString()}</h2>
        </div>
        <div>
            <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>
            <button className="btn">Edit Event</button>
            <button className="btn">Delete Event</button>
        </div>
        </React.Fragment>
    </li>
);

export default eventItem;