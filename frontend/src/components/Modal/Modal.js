import React from 'react';
import './Modal.css';

const modal = props => (
    <div className="Modal">
        <header className="ModalHeader"><h1>{props.title}</h1></header>
        <section className="ModalContent">
            {props.children}
        </section>
        <section className="ModalActions">
            {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
            {props.canConfirm && <button className="btn" onClick={props.onConfirm}>Confirm</button>}
        </section>
    </div>
);

export default modal;