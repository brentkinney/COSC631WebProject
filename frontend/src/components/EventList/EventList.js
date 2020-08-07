import React from 'react';
import './EventList.css';
import EventItem from './EventItem/EventItem.js';

const eventList = props => {
    const events = props.events.map(event => {
        if (props.authUserId === event.createdBy._id) {
        return (        
            <EventItem 
            key={event._id} 
            eventId={event._id} 
            title={event.title}
            price={event.price}
            hours={event.hours}
            date={event.date}
            onDetail={props.onViewDetail}
            onDelete={props.onDeleteEvent}
             />
        )
        }
        return null;
    });
    return (<ul className="EventsList">{events}</ul>)    
};

export default eventList;