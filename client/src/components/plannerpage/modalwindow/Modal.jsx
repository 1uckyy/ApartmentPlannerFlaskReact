import React from 'react';
import ReactDOM from 'react-dom';

import './Modal.css';

export default class Modal extends React.Component {
    componentWillMount() {
        this.root = document.createElement('div');
        document.body.appendChild(this.root);
    }

    componentWillUnmount() {
        document.body.removeChild(this.root);
    }

    componentDidMount() {
        var btn_continue = document.getElementById("btn_continue");
        if(btn_continue)
            btn_continue.setAttribute("onclick", "save_btn()");
    }

    render() {
        return ReactDOM.createPortal(
            <div className="modal">
                <button className="modal__close-button" onClick={this.props.onClose}>Закрыть</button>
                {this.props.children}
            </div>,
            this.root
        );
    }
}