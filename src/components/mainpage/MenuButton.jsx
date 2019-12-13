import React, { Component } from 'react';

class MenuButton extends Component {
    render () {
        return (
            <button className="menu_btn">
                <div className="text_btn">{this.props.text}</div>
                    <div className="icon_btn">
                        <img className="icon_btn_sign_in" src={this.props.icon} alt={this.props.alt} />
                    </div>
            </button>
        )
    }
}

export default MenuButton;
