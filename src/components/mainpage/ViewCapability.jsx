import React, { Component } from 'react';

class ViewCapability extends Component {
    render () {
        return (
            <>
            <div className="black_line"></div>
            <div className="view_capability">
            <img src={this.props.src} alt={this.props.alt} />
            <div className="text_capability">{this.props.text}</div>
            </div>
            </>
        )
    }
}

export default ViewCapability;
